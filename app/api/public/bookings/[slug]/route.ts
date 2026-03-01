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

  if (!data.customerName || !data.customerPhone || !data.date || !data.time) {
    return NextResponse.json(
      { error: 'Name, phone, date, and time are required' },
      { status: 400 }
    )
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      guests: parseInt(data.guests) || 1,
      date: data.date,
      time: data.time,
      notes: data.notes || '',
    },
  })

  return NextResponse.json(booking, { status: 201 })
}
