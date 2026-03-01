'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Language, getCustomerT, detectBrowserLanguage } from '@/lib/translations'
import LanguagePicker from '@/components/menu/LanguagePicker'
import { CalendarCheck, ArrowLeft, CheckCircle, Sprout } from 'lucide-react'

const bookingT: Record<Language, Record<string, string>> = {
  EN: {
    title: 'Book a Table',
    name: 'Your Name',
    phone: 'Phone Number',
    guests: 'Number of Guests',
    date: 'Date',
    time: 'Time',
    notes: 'Special Requests (optional)',
    submit: 'Book Now',
    submitting: 'Booking...',
    backToMenu: 'Back to Menu',
    successTitle: 'Booking Confirmed!',
    successMsg: 'Your reservation has been submitted. The restaurant will confirm your booking.',
    bookAnother: 'Make Another Booking',
  },
  TH: {
    title: 'จองโต๊ะ',
    name: 'ชื่อของคุณ',
    phone: 'เบอร์โทรศัพท์',
    guests: 'จำนวนผู้มาทาน',
    date: 'วันที่',
    time: 'เวลา',
    notes: 'คำขอพิเศษ (ไม่บังคับ)',
    submit: 'จองเลย',
    submitting: 'กำลังจอง...',
    backToMenu: 'กลับไปดูเมนู',
    successTitle: 'จองสำเร็จ!',
    successMsg: 'การจองของคุณถูกส่งแล้ว ร้านอาหารจะยืนยันการจองของคุณ',
    bookAnother: 'จองอีกครั้ง',
  },
  ZH: {
    title: '预订桌位',
    name: '您的姓名',
    phone: '电话号码',
    guests: '用餐人数',
    date: '日期',
    time: '时间',
    notes: '特殊要求（可选）',
    submit: '立即预订',
    submitting: '预订中...',
    backToMenu: '返回菜单',
    successTitle: '预订成功！',
    successMsg: '您的预订已提交。餐厅将确认您的预订。',
    bookAnother: '再次预订',
  },
  JA: {
    title: 'テーブル予約',
    name: 'お名前',
    phone: '電話番号',
    guests: '人数',
    date: '日付',
    time: '時間',
    notes: '特別なリクエスト（任意）',
    submit: '予約する',
    submitting: '予約中...',
    backToMenu: 'メニューに戻る',
    successTitle: '予約完了！',
    successMsg: 'ご予約が送信されました。レストランが確認いたします。',
    bookAnother: '再度予約する',
  },
  ES: {
    title: 'Reservar Mesa',
    name: 'Su Nombre',
    phone: 'Teléfono',
    guests: 'Número de Invitados',
    date: 'Fecha',
    time: 'Hora',
    notes: 'Solicitudes especiales (opcional)',
    submit: 'Reservar Ahora',
    submitting: 'Reservando...',
    backToMenu: 'Volver al Menú',
    successTitle: '¡Reserva Confirmada!',
    successMsg: 'Su reserva ha sido enviada. El restaurante confirmará su reserva.',
    bookAnother: 'Hacer otra reserva',
  },
}

interface Restaurant {
  restaurantName: string
  logo: string | null
  primaryColor: string
}

export default function BookingPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('TH')
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    guests: '2',
    date: '',
    time: '',
    notes: '',
  })

  useEffect(() => {
    setLang(detectBrowserLanguage())
  }, [])

  useEffect(() => {
    fetch(`/api/public/menu/${params.slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.restaurantName) {
          setRestaurant(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  const bt = bookingT[lang] || bookingT['EN']
  const ct = getCustomerT(lang)
  const primaryColor = restaurant?.primaryColor || '#16a34a'

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setForm(f => ({ ...f, date: f.date || today }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/public/bookings/${params.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">{ct.loading}</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{ct.restaurantNotFound}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {restaurant.logo ? (
              <Image
                src={restaurant.logo}
                alt={restaurant.restaurantName}
                width={40}
                height={40}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {restaurant.restaurantName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-900 truncate">{restaurant.restaurantName}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <LanguagePicker current={lang} onChange={setLang} />

        <Link
          href={`/menu/${params.slug}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {bt.backToMenu}
        </Link>

        {success ? (
          <Card className="border-green-200">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{bt.successTitle}</h2>
              <p className="text-muted-foreground mb-6">{bt.successMsg}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false)
                    setForm({ customerName: '', customerPhone: '', guests: '2', date: new Date().toISOString().split('T')[0], time: '', notes: '' })
                  }}
                >
                  {bt.bookAnother}
                </Button>
                <Link href={`/menu/${params.slug}`}>
                  <Button style={{ backgroundColor: primaryColor }}>
                    {bt.backToMenu}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" style={{ color: primaryColor }} />
                {bt.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{bt.name}</Label>
                  <Input
                    value={form.customerName}
                    onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{bt.phone}</Label>
                  <Input
                    type="tel"
                    value={form.customerPhone}
                    onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>{bt.guests}</Label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={form.guests}
                      onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{bt.date}</Label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{bt.time}</Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{bt.notes}</Label>
                  <Textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? bt.submitting : bt.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
