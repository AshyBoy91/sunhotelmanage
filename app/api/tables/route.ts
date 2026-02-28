import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tables = await prisma.table.findMany({
    where: { userId: session.user.id },
    orderBy: { tableNumber: 'asc' },
    include: { qrCode: true },
  })

  return NextResponse.json(tables)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const table = await prisma.table.create({
    data: {
      userId: session.user.id,
      tableNumber: parseInt(data.tableNumber),
      tableName: data.tableName || null,
    },
  })

  // Auto-generate QR code for the table
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const qrUrl = `${baseUrl}/menu/${user.slug}/${table.id}`

  const qrCode = await prisma.qRCode.create({
    data: {
      userId: session.user.id,
      tableId: table.id,
      qrUrl,
    },
  })

  return NextResponse.json({ ...table, qrCode }, { status: 201 })
}
