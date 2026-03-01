'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, ChefHat, CheckCircle, RefreshCw } from 'lucide-react'

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

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  preparing: 'bg-blue-500',
  ready: 'bg-green-500',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
}

const spicyLabels = ['No Spicy', 'Mild', 'Medium', 'Hot']

export default function KitchenPage() {
  const params = useParams()
  const slug = params.slug as string
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/kitchen/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
        setRestaurantName(data.restaurantName)
      }
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [slug])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (err) {
      console.error('Failed to update order', err)
    }
  }

  const timeSince = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
  }

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const preparingOrders = orders.filter(o => o.status === 'preparing')
  const readyOrders = orders.filter(o => o.status === 'ready')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading kitchen display...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-xl font-bold">{restaurantName} - Kitchen</h1>
            <p className="text-sm text-gray-400">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-sm">
            <span className="text-yellow-400">{pendingOrders.length} Pending</span>
            <span className="text-blue-400">{preparingOrders.length} Preparing</span>
            <span className="text-green-400">{readyOrders.length} Ready</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500 text-lg">
            No active orders
          </div>
        )}
        {[...pendingOrders, ...preparingOrders, ...readyOrders].map(order => (
          <Card
            key={order.id}
            className={`border-2 ${
              order.status === 'pending'
                ? 'border-yellow-500 bg-gray-800'
                : order.status === 'preparing'
                ? 'border-blue-500 bg-gray-800'
                : 'border-green-500 bg-gray-800'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  Table {order.tableNumber}
                </CardTitle>
                <Badge className={`${statusColors[order.status]} text-white`}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="w-3 h-3" />
                {timeSince(order.createdAt)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div>
                      <span className="text-white font-medium">
                        {item.quantity}x {item.itemName}
                      </span>
                      {item.spicyLevel > 0 && (
                        <span className="text-red-400 ml-1">
                          {'🌶️'.repeat(item.spicyLevel)} {spicyLabels[item.spicyLevel]}
                        </span>
                      )}
                      {item.notes && (
                        <p className="text-yellow-300 text-xs mt-0.5">Note: {item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {order.notes && (
                <p className="text-yellow-300 text-xs mb-3 p-2 bg-yellow-900/30 rounded">
                  Order note: {order.notes}
                </p>
              )}
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <Button
                    onClick={() => updateStatus(order.id, 'preparing')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Start Preparing
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button
                    onClick={() => updateStatus(order.id, 'ready')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Ready
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    onClick={() => updateStatus(order.id, 'served')}
                    className="w-full bg-gray-600 hover:bg-gray-700"
                  >
                    Served
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
