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

  if (!data.tableId || !data.items || data.items.length === 0) {
    return NextResponse.json(
      { error: 'tableId and items are required' },
      { status: 400 }
    )
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      tableId: data.tableId,
      tableNumber: data.tableNumber || 0,
      notes: data.notes || '',
      items: {
        create: data.items.map((item: { itemName: string; quantity: number; price: number; spicyLevel?: number; notes?: string }) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price,
          spicyLevel: item.spicyLevel || 0,
          notes: item.notes || '',
        })),
      },
    },
    include: { items: true },
  })

  return NextResponse.json(order, { status: 201 })
}
