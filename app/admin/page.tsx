import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adminTranslations, AdminLanguage } from '@/lib/translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UtensilsCrossed, TableProperties, QrCode, ExternalLink } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const lang = (session.user.adminLang || 'EN') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const [menuItemCount, tableCount, qrCount, user] = await Promise.all([
    prisma.menuItem.count({ where: { userId: session.user.id } }),
    prisma.table.count({ where: { userId: session.user.id } }),
    prisma.qRCode.count({ where: { userId: session.user.id } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { slug: true, restaurantName: true } }),
  ])

  const stats = [
    {
      label: t.totalMenuItems,
      value: menuItemCount,
      icon: UtensilsCrossed,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: t.totalTables,
      value: tableCount,
      icon: TableProperties,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t.totalQRCodes,
      value: qrCount,
      icon: QrCode,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu URL */}
      {user?.slug && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Menu URL</CardTitle>
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
      )}
    </div>
  )
}
