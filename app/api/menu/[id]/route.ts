import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  const item = await prisma.menuItem.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: {
      categoryId: data.categoryId,
      nameEn: data.nameEn,
      nameTh: data.nameTh,
      nameZh: data.nameZh,
      nameJa: data.nameJa,
      nameEs: data.nameEs,
      descEn: data.descEn,
      descTh: data.descTh,
      descZh: data.descZh,
      descJa: data.descJa,
      descEs: data.descEs,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl || null,
      hasSpicy: data.hasSpicy,
      available: data.available,
      sortOrder: data.sortOrder,
    },
  })

  return NextResponse.json(item)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.menuItem.deleteMany({
    where: { id: params.id, userId: session.user.id },
  })

  return NextResponse.json({ message: 'Deleted' })
}
