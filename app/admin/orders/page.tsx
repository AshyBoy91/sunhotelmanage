'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { adminTranslations, AdminLanguage } from '@/lib/translations'
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react'

interface OrderItem {
  id: string
  itemName: string
  quantity: number
  price: number
  spicyLevel: number
  notes: string
}

interface Order {
  id: string
  tableNumber: number
  status: string
  notes: string
  createdAt: string
  items: OrderItem[]
}

interface Stats {
  today: { count: number; revenue: number }
  week: { count: number; revenue: number }
  month: { count: number; revenue: number }
  allTime: { count: number; revenue: number }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  preparing: 'bg-blue-500',
  ready: 'bg-green-500',
  served: 'bg-gray-500',
  completed: 'bg-emerald-600',
  cancelled: 'bg-red-500',
}

export default function AdminOrdersPage() {
  const { data: session } = useSession()
  const lang = (session?.user?.adminLang || 'TH') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/orders/stats').then(r => r.json()),
    ]).then(([ordersData, statsData]) => {
      setOrders(ordersData)
      setStats(statsData)
      setLoading(false)
    })
  }, [])

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending: t.pending, preparing: t.preparing, ready: t.ready,
      served: t.served, completed: t.completed, cancelled: t.cancelled,
    }
    return map[s] || s
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const orderTotal = (order: Order) =>
    order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const formatCurrency = (amount: number) => `฿${amount.toLocaleString()}`

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">{t.loading}</div>
  }

  const revenueCards = stats ? [
    { label: t.today, count: stats.today.count, revenue: stats.today.revenue, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t.thisWeek, count: stats.week.count, revenue: stats.week.revenue, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: t.thisMonth, count: stats.month.count, revenue: stats.month.revenue, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t.allTime, count: stats.allTime.count, revenue: stats.allTime.revenue, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
  ] : []

  const filters = [
    { value: 'all', label: t.all },
    { value: 'pending', label: t.pending },
    { value: 'preparing', label: t.preparing },
    { value: 'ready', label: t.ready },
    { value: 'served', label: t.served },
    { value: 'completed', label: t.completed },
    { value: 'cancelled', label: t.cancelled },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.orderHistory}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.revenue}</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueCards.map(card => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(card.revenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.count} {t.orders}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t.noOrders}</div>
        )}
        {filteredOrders.map(order => (
          <Card key={order.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {t.tableNo} {order.tableNumber}
                      </span>
                      <Badge className={`${statusColors[order.status] || 'bg-gray-500'} text-white text-xs`}>
                        {statusLabel(order.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {order.items.map(i => `${i.quantity}x ${i.itemName}`).join(', ')}
                    </div>
                    {order.notes && (
                      <p className="text-xs text-yellow-600 mt-1">Note: {order.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{formatCurrency(orderTotal(order))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
