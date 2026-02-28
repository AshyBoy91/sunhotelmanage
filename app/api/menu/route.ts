import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  if (!data.categoryId) {
    return NextResponse.json({ error: 'categoryId is required' }, { status: 400 })
  }

  // Verify category belongs to user
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, userId: session.user.id },
  })
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const item = await prisma.menuItem.create({
    data: {
      categoryId: data.categoryId,
      userId: session.user.id,
      nameEn: data.nameEn || '',
      nameTh: data.nameTh || '',
      nameZh: data.nameZh || '',
      nameJa: data.nameJa || '',
      nameEs: data.nameEs || '',
      descEn: data.descEn || '',
      descTh: data.descTh || '',
      descZh: data.descZh || '',
      descJa: data.descJa || '',
      descEs: data.descEs || '',
      price: parseFloat(data.price) || 0,
      imageUrl: data.imageUrl || null,
      hasSpicy: data.hasSpicy || false,
      available: data.available !== undefined ? data.available : true,
      sortOrder: data.sortOrder || 0,
    },
  })

  return NextResponse.json(item, { status: 201 })
}
