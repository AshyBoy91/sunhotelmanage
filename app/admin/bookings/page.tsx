'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { adminTranslations, AdminLanguage } from '@/lib/translations'
import { CalendarCheck, Phone, Users, Clock, Check, X, Trash2 } from 'lucide-react'

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  guests: number
  date: string
  time: string
  notes: string
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function BookingsPage() {
  const { data: session } = useSession()
  const lang = (session?.user?.adminLang || 'EN') as AdminLanguage
  const isEN = lang === 'EN'

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings')
    const data = await res.json()
    setBookings(data)
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchBookings()
  }

  const deleteBooking = async (id: string) => {
    if (!confirm(isEN ? 'Delete this booking?' : 'ลบการจองนี้?')) return
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    fetchBookings()
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const statusLabel = (s: string) => {
    const labels: Record<string, Record<string, string>> = {
      pending: { EN: 'Pending', TH: 'รอดำเนินการ' },
      confirmed: { EN: 'Confirmed', TH: 'ยืนยันแล้ว' },
      completed: { EN: 'Completed', TH: 'เสร็จสิ้น' },
      cancelled: { EN: 'Cancelled', TH: 'ยกเลิก' },
    }
    return labels[s]?.[lang] || s
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEN ? 'Table Bookings' : 'การจองโต๊ะ'}
        </h1>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === s
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? (isEN ? 'All' : 'ทั้งหมด') : statusLabel(s)}
              {s !== 'all' && (
                <span className="ml-1">
                  ({bookings.filter(b => b.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{adminTranslations[lang].loading}</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isEN ? 'No bookings yet.' : 'ยังไม่มีการจอง'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{booking.customerName}</h3>
                      <Badge className={statusColors[booking.status] || 'bg-gray-100 text-gray-800'}>
                        {statusLabel(booking.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {booking.customerPhone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {booking.guests} {isEN ? 'guests' : 'ท่าน'}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {booking.time}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-gray-400 italic">{booking.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {booking.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        {isEN ? 'Confirm' : 'ยืนยัน'}
                      </Button>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => updateStatus(booking.id, 'completed')}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        {isEN ? 'Complete' : 'เสร็จสิ้น'}
                      </Button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        {isEN ? 'Cancel' : 'ยกเลิก'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-600"
                      onClick={() => deleteBooking(booking.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
