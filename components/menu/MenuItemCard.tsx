'use client'

import { useState } from 'react'
import { Language, getCustomerT } from '@/lib/translations'
import SpicySelector from './SpicySelector'

interface MenuItem {
  id: string
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  descEn: string; descTh: string; descZh: string; descJa: string; descEs: string
  price: number
  imageUrl: string | null
  hasSpicy: boolean
  available: boolean
}

interface MenuItemCardProps {
  item: MenuItem
  lang: Language
  currency: string
  primaryColor: string
}

const langKey = (lang: Language) => lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase() as 'En' | 'Th' | 'Zh' | 'Ja' | 'Es'

export default function MenuItemCard({ item, lang, currency, primaryColor }: MenuItemCardProps) {
  const [spicyLevel, setSpicyLevel] = useState(0)
  const t = getCustomerT(lang)
  const lk = langKey(lang)

  const name = item[`name${lk}`] || item.nameEn
  const desc = item[`desc${lk}`] || item.descEn

  const formatPrice = (price: number) => {
    const currencySymbols: Record<string, string> = {
      THB: '฿', USD: '$', EUR: '€', JPY: '¥', CNY: '¥', SGD: 'S$',
    }
    return `${currencySymbols[currency] || currency} ${price.toFixed(2)}`
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md ${!item.available ? 'opacity-60' : ''}`}>
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={name}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            {desc && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{desc}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className="font-bold text-base" style={{ color: primaryColor }}>
              {formatPrice(item.price)}
            </span>
          </div>
        </div>

        {!item.available && (
          <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {t.notAvailable}
          </span>
        )}

        {item.hasSpicy && item.available && (
          <SpicySelector value={spicyLevel} onChange={setSpicyLevel} lang={lang} />
        )}
      </div>
    </div>
  )
}
