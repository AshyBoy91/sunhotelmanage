import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { sortOrder: 'asc' },
    include: {
      menuItems: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  const category = await prisma.category.create({
    data: {
      userId: session.user.id,
      nameEn: data.nameEn || '',
      nameTh: data.nameTh || '',
      nameZh: data.nameZh || '',
      nameJa: data.nameJa || '',
      nameEs: data.nameEs || '',
      sortOrder: data.sortOrder || 0,
    },
  })

  return NextResponse.json(category, { status: 201 })
}
