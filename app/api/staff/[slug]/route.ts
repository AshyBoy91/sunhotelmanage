import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await prisma.user.findUnique({
    where: { slug: params.slug },
    select: { id: true, restaurantName: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const today = new Date().toISOString().split('T')[0]

  const [orders, waiterCalls, bookings] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: user.id,
        status: { in: ['pending', 'preparing', 'ready', 'served'] },
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.waiterCall.findMany({
      where: {
        userId: user.id,
        status: 'pending',
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.findMany({
      where: {
        userId: user.id,
        date: today,
        status: { in: ['pending', 'confirmed'] },
      },
      orderBy: { time: 'asc' },
    }),
  ])

  return NextResponse.json({ restaurantName: user.restaurantName, orders, waiterCalls, bookings })
}
