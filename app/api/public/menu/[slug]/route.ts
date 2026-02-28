import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await prisma.user.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      restaurantName: true,
      slug: true,
      logo: true,
      primaryColor: true,
      currency: true,
      categories: {
        orderBy: { sortOrder: 'asc' },
        include: {
          menuItems: {
            where: { available: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}
