'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarCheck, ShoppingCart, Plus, Minus, X, Send, Bell, CheckCircle } from 'lucide-react'
import { Language, getCustomerT, detectBrowserLanguage } from '@/lib/translations'
import LanguagePicker from './LanguagePicker'
import SpicySelector from './SpicySelector'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const bookBtnLabel: Record<Language, string> = {
  EN: 'Book a Table', TH: 'จองโต๊ะ', ZH: '预订桌位', JA: 'テーブル予約', ES: 'Reservar Mesa',
}

const cartT: Record<Language, Record<string, string>> = {
  EN: {
    cart: 'Cart', addToCart: 'Add', viewCart: 'View Cart', placeOrder: 'Place Order',
    orderNotes: 'Order notes (optional)', emptyCart: 'Your cart is empty',
    orderPlaced: 'Order placed!', orderMsg: 'Your order has been sent to the kitchen.',
    continueBrowsing: 'Continue Browsing', total: 'Total', items: 'items',
    callWaiter: 'Call Waiter', waiterCalled: 'Waiter has been called!',
    waiterMsg: 'A staff member will come to your table shortly.',
    spicyLevel: 'Spicy Level', itemNotes: 'Item notes...',
  },
  TH: {
    cart: 'ตะกร้า', addToCart: 'เพิ่ม', viewCart: 'ดูตะกร้า', placeOrder: 'สั่งอาหาร',
    orderNotes: 'หมายเหตุ (ไม่บังคับ)', emptyCart: 'ตะกร้าว่าง',
    orderPlaced: 'สั่งอาหารแล้ว!', orderMsg: 'ออเดอร์ของคุณถูกส่งไปยังครัวแล้ว',
    continueBrowsing: 'ดูเมนูต่อ', total: 'รวม', items: 'รายการ',
    callWaiter: 'เรียกพนักงาน', waiterCalled: 'เรียกพนักงานแล้ว!',
    waiterMsg: 'พนักงานจะมาที่โต๊ะของคุณในไม่ช้า',
    spicyLevel: 'ระดับเผ็ด', itemNotes: 'หมายเหตุ...',
  },
  ZH: {
    cart: '购物车', addToCart: '添加', viewCart: '查看购物车', placeOrder: '下单',
    orderNotes: '备注（可选）', emptyCart: '购物车为空',
    orderPlaced: '下单成功！', orderMsg: '您的订单已发送到厨房。',
    continueBrowsing: '继续浏览', total: '合计', items: '项',
    callWaiter: '呼叫服务员', waiterCalled: '已呼叫服务员！',
    waiterMsg: '工作人员将很快来到您的桌前。',
    spicyLevel: '辣度', itemNotes: '备注...',
  },
  JA: {
    cart: 'カート', addToCart: '追加', viewCart: 'カートを見る', placeOrder: '注文する',
    orderNotes: '注文メモ（任意）', emptyCart: 'カートは空です',
    orderPlaced: '注文完了！', orderMsg: 'ご注文はキッチンに送信されました。',
    continueBrowsing: '閲覧を続ける', total: '合計', items: '品',
    callWaiter: 'ウェイターを呼ぶ', waiterCalled: 'ウェイターを呼びました！',
    waiterMsg: 'スタッフがすぐにテーブルに参ります。',
    spicyLevel: '辛さ', itemNotes: 'メモ...',
  },
  ES: {
    cart: 'Carrito', addToCart: 'Agregar', viewCart: 'Ver carrito', placeOrder: 'Hacer pedido',
    orderNotes: 'Notas del pedido (opcional)', emptyCart: 'El carrito está vacío',
    orderPlaced: '¡Pedido realizado!', orderMsg: 'Su pedido ha sido enviado a la cocina.',
    continueBrowsing: 'Seguir navegando', total: 'Total', items: 'artículos',
    callWaiter: 'Llamar al mesero', waiterCalled: '¡Mesero llamado!',
    waiterMsg: 'Un miembro del personal vendrá a su mesa en breve.',
    spicyLevel: 'Nivel de picante', itemNotes: 'Notas...',
  },
}

interface MenuItem {
  id: string
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  descEn: string; descTh: string; descZh: string; descJa: string; descEs: string
  price: number; imageUrl: string | null; hasSpicy: boolean; available: boolean
}

interface Category {
  id: string
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  menuItems: MenuItem[]
}

interface Restaurant {
  restaurantName: string; slug: string; logo: string | null
  primaryColor: string; currency: string; categories: Category[]
}

interface TableInfo { id: string; tableNumber: number; tableName: string | null }

interface CartItem {
  menuItemId: string; name: string; price: number
  quantity: number; spicyLevel: number; notes: string
}

type LK = 'En' | 'Th' | 'Zh' | 'Ja' | 'Es'
const langKey = (lang: Language): LK =>
  (lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()) as LK

const currencySymbols: Record<string, string> = {
  THB: '฿', USD: '$', EUR: '€', JPY: '¥', CNY: '¥', SGD: 'S$',
}

interface CustomerMenuProps { slug: string; tableId?: string }

export default function CustomerMenu({ slug, tableId }: CustomerMenuProps) {
  const [lang, setLang] = useState<Language>('TH')
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState<string>('all')
  const [error, setError] = useState('')

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Waiter call state
  const [waiterCalled, setWaiterCalled] = useState(false)

  // Item detail state (for adding to cart)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [itemSpicy, setItemSpicy] = useState(0)
  const [itemNotes, setItemNotes] = useState('')
  const [itemQty, setItemQty] = useState(1)

  useEffect(() => { setLang(detectBrowserLanguage()) }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, tableRes] = await Promise.all([
          fetch(`/api/public/menu/${slug}`),
          tableId ? fetch(`/api/public/table/${tableId}`) : Promise.resolve(null),
        ])
        if (!menuRes.ok) { setError('not found'); setLoading(false); return }
        setRestaurant(await menuRes.json())
        if (tableRes?.ok) setTableInfo(await tableRes.json())
      } catch { setError('failed') }
      finally { setLoading(false) }
    }
    fetchData()
  }, [slug, tableId])

  const t = getCustomerT(lang)
  const ct = cartT[lang] || cartT['EN']

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground animate-pulse">{t.loading}</p></div>
  if (error || !restaurant) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t.restaurantNotFound}</p></div>

  const lk = langKey(lang)
  const primaryColor = restaurant.primaryColor || '#16a34a'
  const sym = currencySymbols[restaurant.currency] || restaurant.currency

  const displayCategories = activeCat === 'all'
    ? restaurant.categories
    : restaurant.categories.filter(c => c.id === activeCat)

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  const addToCart = () => {
    if (!selectedItem) return
    const name = selectedItem[`name${lk}`] || selectedItem.nameEn
    const existing = cart.findIndex(c => c.menuItemId === selectedItem.id && c.spicyLevel === itemSpicy && c.notes === itemNotes)
    if (existing >= 0) {
      setCart(prev => prev.map((c, i) => i === existing ? { ...c, quantity: c.quantity + itemQty } : c))
    } else {
      setCart(prev => [...prev, { menuItemId: selectedItem.id, name, price: selectedItem.price, quantity: itemQty, spicyLevel: itemSpicy, notes: itemNotes }])
    }
    setSelectedItem(null)
    setItemSpicy(0)
    setItemNotes('')
    setItemQty(1)
  }

  const removeFromCart = (index: number) => setCart(prev => prev.filter((_, i) => i !== index))
  const updateQty = (index: number, delta: number) => {
    setCart(prev => prev.map((item, i) => {
      if (i !== index) return item
      const newQty = item.quantity + delta
      return newQty <= 0 ? item : { ...item, quantity: newQty }
    }).filter(item => item.quantity > 0))
  }

  const placeOrder = async () => {
    if (cart.length === 0 || !tableId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/public/orders/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          tableNumber: tableInfo?.tableNumber || 0,
          notes: orderNotes,
          items: cart.map(c => ({
            itemName: c.name,
            quantity: c.quantity,
            price: c.price,
            spicyLevel: c.spicyLevel,
            notes: c.notes,
          })),
        }),
      })
      if (res.ok) {
        setOrderPlaced(true)
        setCart([])
        setOrderNotes('')
        setShowCart(false)
      }
    } finally { setSubmitting(false) }
  }

  const callWaiter = async () => {
    if (!tableId || !tableInfo) return
    await fetch(`/api/public/waiter-call/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableId, tableNumber: tableInfo.tableNumber }),
    })
    setWaiterCalled(true)
    setTimeout(() => setWaiterCalled(false), 5000)
  }

  // Order success view
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{ct.orderPlaced}</h2>
          <p className="text-muted-foreground mb-6">{ct.orderMsg}</p>
          <Button onClick={() => setOrderPlaced(false)} style={{ backgroundColor: primaryColor }} className="w-full">
            {ct.continueBrowsing}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {restaurant.logo ? (
              <Image src={restaurant.logo} alt={restaurant.restaurantName} width={40} height={40} className="rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                {restaurant.restaurantName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-gray-900 truncate">{restaurant.restaurantName}</h1>
              {tableInfo && <p className="text-xs text-muted-foreground">{t.table} #{tableInfo.tableNumber}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {tableId && (
                <button
                  onClick={callWaiter}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{ct.callWaiter}</span>
                </button>
              )}
              <Link href={`/menu/${slug}/book`} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                <CalendarCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{bookBtnLabel[lang]}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Waiter called toast */}
      {waiterCalled && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Bell className="h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">{ct.waiterCalled}</p>
            <p className="text-xs text-green-100">{ct.waiterMsg}</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <LanguagePicker current={lang} onChange={setLang} />

        {/* Category Filter */}
        {restaurant.categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActiveCat('all')} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCat === 'all' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`} style={activeCat === 'all' ? { backgroundColor: primaryColor } : {}}>
              {t.allItems}
            </button>
            {restaurant.categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCat === cat.id ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`} style={activeCat === cat.id ? { backgroundColor: primaryColor } : {}}>
                {cat[`name${lk}`] || cat.nameEn}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        {displayCategories.map(cat => (
          <section key={cat.id}>
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3 mt-4">{cat[`name${lk}`] || cat.nameEn}</h2>
            <div className="space-y-2">
              {cat.menuItems.map(item => {
                const name = item[`name${lk}`] || item.nameEn
                const desc = item[`desc${lk}`] || item.descEn
                return (
                  <div key={item.id} className={`bg-white rounded-xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md ${!item.available ? 'opacity-50' : 'cursor-pointer'}`} onClick={() => item.available && setSelectedItem(item)}>
                    <div className="flex">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={name} className="w-24 h-24 object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 p-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">{name}</h3>
                            {desc && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{desc}</p>}
                            {item.hasSpicy && <span className="text-xs">🌶️</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="font-bold text-sm" style={{ color: primaryColor }}>{sym}{item.price.toFixed(0)}</span>
                            {item.available && tableId && (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                                <Plus className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Add to Cart Modal */}
      {selectedItem && tableId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setSelectedItem(null)}>
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg">{selectedItem[`name${lk}`] || selectedItem.nameEn}</h3>
              <button onClick={() => setSelectedItem(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            {selectedItem.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedItem.imageUrl} alt="" className="w-full h-40 object-cover rounded-lg" />
            )}
            <p className="text-sm text-gray-500">{selectedItem[`desc${lk}`] || selectedItem.descEn}</p>
            <p className="font-bold text-lg" style={{ color: primaryColor }}>{sym}{selectedItem.price.toFixed(0)}</p>

            {selectedItem.hasSpicy && (
              <SpicySelector value={itemSpicy} onChange={setItemSpicy} lang={lang} />
            )}

            <Textarea placeholder={ct.itemNotes} value={itemNotes} onChange={e => setItemNotes(e.target.value)} rows={2} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-1">
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200" onClick={() => setItemQty(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
                <span className="font-bold w-6 text-center">{itemQty}</span>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200" onClick={() => setItemQty(q => q + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <Button onClick={addToCart} style={{ backgroundColor: primaryColor }} className="px-6">
                {ct.addToCart} — {sym}{(selectedItem.price * itemQty).toFixed(0)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sheet */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => setShowCart(false)}>
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-lg">{ct.cart} ({cartCount} {ct.items})</h3>
              <button onClick={() => setShowCart(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{ct.emptyCart}</p>
              ) : (
                <>
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {sym}{item.price.toFixed(0)} x {item.quantity}
                          {item.spicyLevel > 0 && ` • ${'🌶️'.repeat(item.spicyLevel)}`}
                        </p>
                        {item.notes && <p className="text-xs text-gray-400 italic mt-0.5">{item.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white rounded-full border">
                          <button className="w-6 h-6 flex items-center justify-center" onClick={() => updateQty(idx, -1)}><Minus className="h-3 w-3" /></button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button className="w-6 h-6 flex items-center justify-center" onClick={() => updateQty(idx, 1)}><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  <Textarea placeholder={ct.orderNotes} value={orderNotes} onChange={e => setOrderNotes(e.target.value)} rows={2} />
                </>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>{ct.total}</span>
                  <span style={{ color: primaryColor }}>{sym}{cartTotal.toFixed(0)}</span>
                </div>
                <Button onClick={placeOrder} disabled={submitting} className="w-full" style={{ backgroundColor: primaryColor }}>
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? '...' : ct.placeOrder}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {tableId && cart.length > 0 && !showCart && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-3 text-white px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold">{ct.viewCart} ({cartCount})</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm font-bold">{sym}{cartTotal.toFixed(0)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
