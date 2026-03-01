import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await prisma.user.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  const data = await req.json()

  const call = await prisma.waiterCall.create({
    data: {
      userId: user.id,
      tableId: data.tableId,
      tableNumber: data.tableNumber || 0,
    },
  })

  return NextResponse.json(call, { status: 201 })
}
