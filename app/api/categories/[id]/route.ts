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

  const category = await prisma.category.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: {
      nameEn: data.nameEn,
      nameTh: data.nameTh,
      nameZh: data.nameZh,
      nameJa: data.nameJa,
      nameEs: data.nameEs,
      sortOrder: data.sortOrder,
    },
  })

  return NextResponse.json(category)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.category.deleteMany({
    where: { id: params.id, userId: session.user.id },
  })

  return NextResponse.json({ message: 'Deleted' })
}
