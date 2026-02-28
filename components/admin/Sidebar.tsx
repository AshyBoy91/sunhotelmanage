'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  UtensilsCrossed,
  TableProperties,
  QrCode,
  Settings,
  LogOut,
  ChefHat,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminTranslations, AdminLanguage } from '@/lib/translations'

export default function AdminSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const lang = (session?.user?.adminLang || 'EN') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: t.dashboard },
    { href: '/admin/menu', icon: UtensilsCrossed, label: t.menu },
    { href: '/admin/tables', icon: TableProperties, label: t.tables },
    { href: '/admin/qrcodes', icon: QrCode, label: t.qrCodes },
    { href: '/admin/settings', icon: Settings, label: t.settings },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-white rounded-lg p-2">
            <ChefHat className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {session?.user?.name || 'Restaurant'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          {t.logout}
        </button>
      </div>
    </aside>
  )
}
