'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { adminTranslations, AdminLanguage } from '@/lib/translations'

interface Settings {
  restaurantName: string
  logo: string
  primaryColor: string
  currency: string
  adminLang: string
  slug: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const lang = (session?.user?.adminLang || 'EN') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const [settings, setSettings] = useState<Settings>({
    restaurantName: '',
    logo: '',
    primaryColor: '#f97316',
    currency: 'THB',
    adminLang: 'EN',
    slug: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data) {
          setSettings({
            restaurantName: data.restaurantName || '',
            logo: data.logo || '',
            primaryColor: data.primaryColor || '#f97316',
            currency: data.currency || 'THB',
            adminLang: data.adminLang || 'EN',
            slug: data.slug || '',
          })
        }
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setMessage(t.success)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(t.error)
      }
    } catch {
      setMessage(t.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{t.settings}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.restaurantName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t.restaurantName}</Label>
            <Input
              value={settings.restaurantName}
              onChange={e => setSettings(s => ({ ...s, restaurantName: e.target.value }))}
              placeholder="My Restaurant"
            />
          </div>

          <div className="space-y-2">
            <Label>Menu Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/menu/</span>
              <Input
                value={settings.slug}
                disabled
                className="bg-muted"
              />
            </div>
            <p className="text-xs text-muted-foreground">Slug cannot be changed after creation</p>
          </div>

          <div className="space-y-2">
            <Label>{t.logo}</Label>
            <Input
              value={settings.logo}
              onChange={e => setSettings(s => ({ ...s, logo: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
            {settings.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo} alt="Logo preview" className="h-16 object-contain rounded border" />
            )}
          </div>

          <div className="space-y-2">
            <Label>{t.primaryColor}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                className="h-10 w-16 cursor-pointer rounded border"
              />
              <Input
                value={settings.primaryColor}
                onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                placeholder="#f97316"
                className="w-32"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.currency}</Label>
            <Select
              value={settings.currency}
              onValueChange={val => setSettings(s => ({ ...s, currency: val }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THB">THB (฿)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
                <SelectItem value="SGD">SGD (S$)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.adminLanguage}</Label>
            <Select
              value={settings.adminLang}
              onValueChange={val => setSettings(s => ({ ...s, adminLang: val }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">🇬🇧 {t.english}</SelectItem>
                <SelectItem value="TH">🇹🇭 {t.thai}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {message && (
        <div className={`text-sm p-3 rounded-md ${message === t.success ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message}
        </div>
      )}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? t.loading : t.saveSettings}
      </Button>
    </div>
  )
}
