import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      restaurantName: true,
      slug: true,
      logo: true,
      primaryColor: true,
      currency: true,
      adminLang: true,
    },
  })

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      restaurantName: data.restaurantName,
      logo: data.logo || null,
      primaryColor: data.primaryColor,
      currency: data.currency,
      adminLang: data.adminLang,
    },
    select: {
      id: true,
      restaurantName: true,
      slug: true,
      logo: true,
      primaryColor: true,
      currency: true,
      adminLang: true,
    },
  })

  return NextResponse.json(user)
}
