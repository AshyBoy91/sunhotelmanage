import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [todayOrders, weekOrders, monthOrders, allOrders] = await Promise.all([
    prisma.order.findMany({
      where: { userId, createdAt: { gte: todayStart }, status: { not: 'cancelled' } },
      include: { items: true },
    }),
    prisma.order.findMany({
      where: { userId, createdAt: { gte: weekStart }, status: { not: 'cancelled' } },
      include: { items: true },
    }),
    prisma.order.findMany({
      where: { userId, createdAt: { gte: monthStart }, status: { not: 'cancelled' } },
      include: { items: true },
    }),
    prisma.order.findMany({
      where: { userId, status: { not: 'cancelled' } },
      include: { items: true },
    }),
  ])

  const calcRevenue = (orders: typeof allOrders) =>
    orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0)

  return NextResponse.json({
    today: { count: todayOrders.length, revenue: calcRevenue(todayOrders) },
    week: { count: weekOrders.length, revenue: calcRevenue(weekOrders) },
    month: { count: monthOrders.length, revenue: calcRevenue(monthOrders) },
    allTime: { count: allOrders.length, revenue: calcRevenue(allOrders) },
  })
}
