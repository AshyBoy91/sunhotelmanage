'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AdminLanguage } from '@/lib/translations'

export default function AdminTopBar() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const lang = (session?.user?.adminLang || 'TH') as AdminLanguage

  const toggleLang = async (newLang: AdminLanguage) => {
    if (newLang === lang) return
    try {
      // Update in database
      await fetch('/api/settings/lang', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminLang: newLang }),
      })
      // Update session
      await update({ adminLang: newLang })
      // Refresh page to re-render with new language
      router.refresh()
    } catch (err) {
      console.error('Failed to update language', err)
    }
  }

  return (
    <div className="bg-white border-b px-6 py-2 flex items-center justify-end">
      <div className="flex items-center bg-gray-100 rounded-full p-0.5">
        <button
          onClick={() => toggleLang('TH')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            lang === 'TH' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          TH
        </button>
        <button
          onClick={() => toggleLang('EN')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            lang === 'EN' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  )
}
