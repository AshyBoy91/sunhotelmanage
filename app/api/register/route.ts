import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { defaultCategories, defaultMenuItems } from '@/lib/default-menu'

export async function POST(req: NextRequest) {
  try {
    const { email, password, restaurantName, slug } = await req.json()

    if (!email || !password || !restaurantName || !slug) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { slug }] },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Slug already taken' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        restaurantName,
        slug,
      },
    })

    // Seed default categories and menu items
    const createdCategories = []
    for (const cat of defaultCategories) {
      const created = await prisma.category.create({
        data: { userId: user.id, ...cat },
      })
      createdCategories.push(created)
    }

    for (const item of defaultMenuItems) {
      const { categoryIndex, ...itemData } = item
      const category = createdCategories[categoryIndex]
      if (category) {
        await prisma.menuItem.create({
          data: {
            userId: user.id,
            categoryId: category.id,
            ...itemData,
            available: true,
          },
        })
      }
    }

    // Seed 15 default tables with QR codes
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    for (let i = 1; i <= 15; i++) {
      const table = await prisma.table.create({
        data: { userId: user.id, tableNumber: i },
      })
      await prisma.qRCode.create({
        data: {
          userId: user.id,
          tableId: table.id,
          qrUrl: `${baseUrl}/menu/${slug}/${table.id}`,
        },
      })
    }

    return NextResponse.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
