'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bell,
  Clock,
  Users,
  ShoppingBag,
  CalendarCheck,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface OrderItem {
  id: string
  itemName: string
  quantity: number
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

interface WaiterCall {
  id: string
  tableNumber: number
  createdAt: string
  status: string
}

interface Booking {
  id: string
  customerName: string
  phone: string
  date: string
  time: string
  guests: number
  status: string
  notes: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  preparing: 'bg-blue-500',
  ready: 'bg-green-500',
  served: 'bg-gray-500',
  confirmed: 'bg-green-500',
  cancelled: 'bg-red-500',
}

export default function StaffPage() {
  const params = useParams()
  const slug = params.slug as string
  const [orders, setOrders] = useState<Order[]>([])
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'calls' | 'bookings'>('orders')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/staff/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders)
        setWaiterCalls(data.waiterCalls)
        setBookings(data.bookings)
        setRestaurantName(data.restaurantName)
      }
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [slug])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
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

  const dismissWaiterCall = async (callId: string) => {
    try {
      await fetch(`/api/waiter-calls/${callId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'acknowledged' }),
      })
      setWaiterCalls(prev => prev.filter(c => c.id !== callId))
    } catch (err) {
      console.error('Failed to dismiss call', err)
    }
  }

  const timeSince = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading staff dashboard...</div>
      </div>
    )
  }

  const pendingCalls = waiterCalls.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-green-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">{restaurantName} - Front Desk</h1>
            <p className="text-sm text-gray-400">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Waiter Call Alert Banner */}
      {pendingCalls > 0 && (
        <div className="bg-red-500 text-white px-4 py-3 flex items-center gap-3 animate-pulse">
          <Bell className="w-6 h-6" />
          <span className="font-bold text-lg">
            {pendingCalls} table{pendingCalls > 1 ? 's' : ''} calling for waiter!
          </span>
          <div className="flex gap-2 ml-4">
            {waiterCalls.map(call => (
              <Button
                key={call.id}
                size="sm"
                variant="secondary"
                onClick={() => dismissWaiterCall(call.id)}
                className="bg-white text-red-600 hover:bg-red-50"
              >
                Table {call.tableNumber} - Acknowledge
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b px-4">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-1" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors relative ${
              activeTab === 'calls'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-1" />
            Waiter Calls
            {pendingCalls > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {pendingCalls}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarCheck className="w-4 h-4 inline mr-1" />
            Today's Bookings ({bookings.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-7xl mx-auto">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400">
                No active orders
              </div>
            )}
            {orders.map(order => (
              <Card key={order.id} className="border-l-4" style={{
                borderLeftColor: order.status === 'pending' ? '#eab308' : order.status === 'preparing' ? '#3b82f6' : order.status === 'ready' ? '#22c55e' : '#6b7280'
              }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Table {order.tableNumber}</CardTitle>
                    <Badge className={`${statusColors[order.status]} text-white`}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {timeSince(order.createdAt)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 mb-3 text-sm">
                    {order.items.map(item => (
                      <div key={item.id} className="text-gray-600">
                        {item.quantity}x {item.itemName}
                        {item.spicyLevel > 0 && (
                          <span className="text-red-500 ml-1">
                            {'🌶️'.repeat(item.spicyLevel)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'ready' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Mark Served
                      </Button>
                    )}
                    {order.status === 'served' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="w-full bg-gray-600 hover:bg-gray-700"
                      >
                        Complete
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="text-red-500 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Waiter Calls Tab */}
        {activeTab === 'calls' && (
          <div className="space-y-3">
            {waiterCalls.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                No pending waiter calls
              </div>
            )}
            {waiterCalls.map(call => (
              <Card key={call.id} className="border-l-4 border-l-red-500">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <Bell className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="font-bold text-lg">Table {call.tableNumber}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeSince(call.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => dismissWaiterCall(call.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Acknowledge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                No bookings for today
              </div>
            )}
            {bookings.map(booking => (
              <Card key={booking.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <CalendarCheck className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-bold">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.time} | {booking.guests} guest{booking.guests > 1 ? 's' : ''} | {booking.phone}
                      </p>
                      {booking.notes && (
                        <p className="text-xs text-gray-400 mt-1">Note: {booking.notes}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={`${statusColors[booking.status] || 'bg-gray-500'} text-white`}>
                    {booking.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
