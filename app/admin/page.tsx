import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adminTranslations, AdminLanguage } from '@/lib/translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UtensilsCrossed, TableProperties, QrCode, ExternalLink, ChefHat, Users, ShoppingBag, DollarSign } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const lang = (session.user.adminLang || 'TH') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const [menuItemCount, tableCount, qrCount, user, orderCount, orders] = await Promise.all([
    prisma.menuItem.count({ where: { userId: session.user.id } }),
    prisma.table.count({ where: { userId: session.user.id } }),
    prisma.qRCode.count({ where: { userId: session.user.id } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { slug: true, restaurantName: true } }),
    prisma.order.count({ where: { userId: session.user.id, status: { not: 'cancelled' } } }),
    prisma.order.findMany({
      where: { userId: session.user.id, status: { not: 'cancelled' } },
      include: { items: true },
    }),
  ])

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  )

  const stats = [
    { label: t.totalMenuItems, value: menuItemCount, icon: UtensilsCrossed, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: t.totalTables, value: tableCount, icon: TableProperties, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t.totalQRCodes, value: qrCount, icon: QrCode, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t.totalOrders, value: orderCount, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: t.totalRevenue, value: `฿${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {session.user.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Links */}
      {user?.slug && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.menuUrl}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm text-orange-600 break-all">
                  /menu/{user.slug}
                </code>
                <a
                  href={`/menu/${user.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                  <ChefHat className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{t.kitchenDisplay}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {t.kitchenDesc}
                </p>
                <a
                  href={`/kitchen/${user.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-orange-600 hover:underline"
                >
                  {t.openKitchen} <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{t.frontDesk}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {t.frontDeskDesc}
                </p>
                <a
                  href={`/staff/${user.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-600 hover:underline"
                >
                  {t.openFrontDesk} <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
