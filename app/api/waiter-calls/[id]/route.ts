import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json()

  await prisma.waiterCall.update({
    where: { id: params.id },
    data: { status: data.status },
  })

  return NextResponse.json({ message: 'Updated' })
}
