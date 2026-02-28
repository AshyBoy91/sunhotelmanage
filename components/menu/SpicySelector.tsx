'use client'

import { Language, getCustomerT } from '@/lib/translations'

interface SpicySelectorProps {
  value: number
  onChange: (level: number) => void
  lang: Language
}

const SPICY_LEVELS = [
  { level: 0, emoji: '❌', key: 'noSpicy' },
  { level: 1, emoji: '🌶️', key: 'mild' },
  { level: 2, emoji: '🌶️🌶️', key: 'medium' },
  { level: 3, emoji: '🌶️🌶️🌶️', key: 'hot' },
]

export default function SpicySelector({ value, onChange, lang }: SpicySelectorProps) {
  const t = getCustomerT(lang)
  return (
    <div className="mt-3">
      <p className="text-xs text-muted-foreground mb-2">{t.spicyLevel}:</p>
      <div className="flex flex-wrap gap-2">
        {SPICY_LEVELS.map(({ level, emoji, key }) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
              value === level
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50 hover:border-red-200'
            }`}
          >
            <span>{emoji}</span>
            <span>{t[key]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
