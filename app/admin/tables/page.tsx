'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { adminTranslations, AdminLanguage } from '@/lib/translations'
import { Plus, Trash2, TableProperties, QrCode } from 'lucide-react'

interface Table {
  id: string
  tableNumber: number
  tableName: string | null
  qrCode?: { qrUrl: string } | null
}

export default function TablesPage() {
  const { data: session } = useSession()
  const lang = (session?.user?.adminLang || 'EN') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ tableNumber: '', tableName: '' })
  const [saving, setSaving] = useState(false)

  const fetchTables = async () => {
    const res = await fetch('/api/tables')
    const data = await res.json()
    setTables(data)
    setLoading(false)
  }

  useEffect(() => { fetchTables() }, [])

  const handleAdd = async () => {
    if (!form.tableNumber) return
    setSaving(true)
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowAdd(false)
        setForm({ tableNumber: '', tableName: '' })
        fetchTables()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return
    await fetch(`/api/tables/${id}`, { method: 'DELETE' })
    fetchTables()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t.tables}</h1>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addTable}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t.loading}</p>
      ) : tables.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TableProperties className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noTables}</p>
            <Button className="mt-4" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t.addTable}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map(table => (
            <Card key={table.id} className="relative group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      #{table.tableNumber}
                    </div>
                    {table.tableName && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {table.tableName}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {table.qrCode && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                    <QrCode className="h-3 w-3" />
                    <span>QR Ready</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addTable}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.tableNumber}</Label>
              <Input
                type="number"
                min="1"
                value={form.tableNumber}
                onChange={e => setForm(f => ({ ...f, tableNumber: e.target.value }))}
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.tableName}</Label>
              <Input
                value={form.tableName}
                onChange={e => setForm(f => ({ ...f, tableName: e.target.value }))}
                placeholder="VIP Table, Window Seat..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>{t.cancel}</Button>
            <Button onClick={handleAdd} disabled={saving || !form.tableNumber}>
              {saving ? t.loading : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
