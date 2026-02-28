'use client'

import { LANGUAGES, Language } from '@/lib/translations'

interface LanguagePickerProps {
  current: Language
  onChange: (lang: Language) => void
}

export default function LanguagePicker({ current, onChange }: LanguagePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            current === lang.code
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  )
}
