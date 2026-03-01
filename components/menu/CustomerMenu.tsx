'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarCheck } from 'lucide-react'
import { Language, getCustomerT, detectBrowserLanguage } from '@/lib/translations'
import LanguagePicker from './LanguagePicker'
import MenuItemCard from './MenuItemCard'

const bookBtnLabel: Record<Language, string> = {
  EN: 'Book a Table',
  TH: 'จองโต๊ะ',
  ZH: '预订桌位',
  JA: 'テーブル予約',
  ES: 'Reservar Mesa',
}

interface MenuItem {
  id: string
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  descEn: string; descTh: string; descZh: string; descJa: string; descEs: string
  price: number
  imageUrl: string | null
  hasSpicy: boolean
  available: boolean
}

interface Category {
  id: string
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  menuItems: MenuItem[]
}

interface Restaurant {
  restaurantName: string
  slug: string
  logo: string | null
  primaryColor: string
  currency: string
  categories: Category[]
}

interface TableInfo {
  tableNumber: number
  tableName: string | null
}

const langKey = (lang: Language) =>
  (lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()) as 'En' | 'Th' | 'Zh' | 'Ja' | 'Es'

interface CustomerMenuProps {
  slug: string
  tableId?: string
}

export default function CustomerMenu({ slug, tableId }: CustomerMenuProps) {
  const [lang, setLang] = useState<Language>('EN')
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState<string>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    setLang(detectBrowserLanguage())
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, tableRes] = await Promise.all([
          fetch(`/api/public/menu/${slug}`),
          tableId ? fetch(`/api/public/table/${tableId}`) : Promise.resolve(null),
        ])

        if (!menuRes.ok) {
          setError('restaurant not found')
          setLoading(false)
          return
        }

        const menuData = await menuRes.json()
        setRestaurant(menuData)

        if (tableRes && tableRes.ok) {
          const tableData = await tableRes.json()
          setTableInfo(tableData)
        }
      } catch {
        setError('failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, tableId])

  const t = getCustomerT(lang)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">{t.loading}</p>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t.restaurantNotFound}</p>
      </div>
    )
  }

  const lk = langKey(lang)
  const primaryColor = restaurant.primaryColor || '#f97316'

  // Filter items by selected category
  const displayCategories = activeCat === 'all'
    ? restaurant.categories
    : restaurant.categories.filter(c => c.id === activeCat)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {restaurant.logo ? (
              <Image
                src={restaurant.logo}
                alt={restaurant.restaurantName}
                width={48}
                height={48}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {restaurant.restaurantName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-lg text-gray-900 truncate">
                {restaurant.restaurantName}
              </h1>
              {tableInfo && (
                <p className="text-sm text-muted-foreground">
                  {t.table} #{tableInfo.tableNumber}
                  {tableInfo.tableName && ` — ${tableInfo.tableName}`}
                </p>
              )}
            </div>
            <Link
              href={`/menu/${slug}/book`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <CalendarCheck className="h-4 w-4" />
              <span className="hidden sm:inline">{bookBtnLabel[lang]}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Language Picker */}
        <LanguagePicker current={lang} onChange={setLang} />

        {/* Category Filter */}
        {restaurant.categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCat('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCat === 'all'
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
              style={activeCat === 'all' ? { backgroundColor: primaryColor } : {}}
            >
              {t.allItems}
            </button>
            {restaurant.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat.id
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
                style={activeCat === cat.id ? { backgroundColor: primaryColor } : {}}
              >
                {cat[`name${lk}`] || cat.nameEn}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        {displayCategories.map(cat => (
          <section key={cat.id}>
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3 mt-4">
              {cat[`name${lk}`] || cat.nameEn}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.menuItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  lang={lang}
                  currency={restaurant.currency}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          </section>
        ))}

        {displayCategories.every(c => c.menuItems.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t.allItems}</p>
          </div>
        )}
      </div>
    </div>
  )
}
