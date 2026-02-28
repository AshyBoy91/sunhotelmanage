import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { tableId: string } }
) {
  const table = await prisma.table.findUnique({
    where: { id: params.tableId },
    select: {
      id: true,
      tableNumber: true,
      tableName: true,
    },
  })

  if (!table) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 })
  }

  return NextResponse.json(table)
}
