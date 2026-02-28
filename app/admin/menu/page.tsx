'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { adminTranslations, AdminLanguage } from '@/lib/translations'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react'

interface MenuItem {
  id: string
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  descEn: string; descTh: string; descZh: string; descJa: string; descEs: string
  price: number
  imageUrl: string | null
  hasSpicy: boolean
  available: boolean
  sortOrder: number
}

interface Category {
  id: string
  nameEn: string; nameTh: string; nameZh: string; nameJa: string; nameEs: string
  sortOrder: number
  menuItems: MenuItem[]
}

const emptyCat = (): Omit<Category, 'id' | 'menuItems'> => ({
  nameEn: '', nameTh: '', nameZh: '', nameJa: '', nameEs: '', sortOrder: 0,
})

const emptyItem = (categoryId: string): Omit<MenuItem, 'id'> & { categoryId: string } => ({
  categoryId,
  nameEn: '', nameTh: '', nameZh: '', nameJa: '', nameEs: '',
  descEn: '', descTh: '', descZh: '', descJa: '', descEs: '',
  price: 0, imageUrl: '', hasSpicy: false, available: true, sortOrder: 0,
})

export default function MenuPage() {
  const { data: session } = useSession()
  const lang = (session?.user?.adminLang || 'EN') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())

  // Category dialog state
  const [catDialog, setCatDialog] = useState<{ open: boolean; editing?: Category }>({ open: false })
  const [catForm, setCatForm] = useState(emptyCat())
  const [catSaving, setCatSaving] = useState(false)

  // Item dialog state
  const [itemDialog, setItemDialog] = useState<{ open: boolean; categoryId: string; editing?: MenuItem }>({ open: false, categoryId: '' })
  const [itemForm, setItemForm] = useState(emptyItem(''))
  const [itemSaving, setItemSaving] = useState(false)

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const toggleCat = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Category CRUD
  const openAddCat = () => {
    setCatForm(emptyCat())
    setCatDialog({ open: true })
  }
  const openEditCat = (cat: Category) => {
    setCatForm({ nameEn: cat.nameEn, nameTh: cat.nameTh, nameZh: cat.nameZh, nameJa: cat.nameJa, nameEs: cat.nameEs, sortOrder: cat.sortOrder })
    setCatDialog({ open: true, editing: cat })
  }
  const saveCat = async () => {
    setCatSaving(true)
    try {
      if (catDialog.editing) {
        await fetch(`/api/categories/${catDialog.editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm),
        })
      } else {
        await fetch('/api/categories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm),
        })
      }
      setCatDialog({ open: false })
      fetchCategories()
    } finally {
      setCatSaving(false)
    }
  }
  const deleteCat = async (id: string) => {
    if (!confirm(t.confirmDelete)) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  // MenuItem CRUD
  const openAddItem = (categoryId: string) => {
    setItemForm(emptyItem(categoryId))
    setItemDialog({ open: true, categoryId })
  }
  const openEditItem = (item: MenuItem, categoryId: string) => {
    setItemForm({ ...item, categoryId, imageUrl: item.imageUrl || '' })
    setItemDialog({ open: true, categoryId, editing: item })
  }
  const saveItem = async () => {
    setItemSaving(true)
    try {
      const body = { ...itemForm, price: parseFloat(String(itemForm.price)) || 0 }
      if (itemDialog.editing) {
        await fetch(`/api/menu/${itemDialog.editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        await fetch('/api/menu', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      setItemDialog({ open: false, categoryId: '' })
      fetchCategories()
    } finally {
      setItemSaving(false)
    }
  }
  const deleteItem = async (id: string) => {
    if (!confirm(t.confirmDelete)) return
    await fetch(`/api/menu/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t.menu}</h1>
        <Button onClick={openAddCat}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addCategory}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t.loading}</p>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noCategories}</p>
            <Button className="mt-4" onClick={openAddCat}>
              <Plus className="h-4 w-4 mr-2" />
              {t.addCategory}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => {
            const isExpanded = expandedCats.has(cat.id)
            return (
              <Card key={cat.id}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-lg"
                  onClick={() => toggleCat(cat.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    <div>
                      <span className="font-medium">{cat.nameEn}</span>
                      {cat.nameTh && <span className="text-muted-foreground ml-2 text-sm">({cat.nameTh})</span>}
                    </div>
                    <Badge variant="secondary">{cat.menuItems.length}</Badge>
                  </div>
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" onClick={() => openEditCat(cat)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteCat(cat.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="pt-0 pb-4">
                    <div className="border-t pt-4 space-y-2">
                      {cat.menuItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">{t.noMenuItems}</p>
                      ) : (
                        cat.menuItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 min-w-0">
                              {item.imageUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.imageUrl} alt={item.nameEn} className="h-10 w-10 object-cover rounded" />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{item.nameEn}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.price.toFixed(2)} &nbsp;
                                  {item.hasSpicy && <span className="text-red-500">🌶️</span>}
                                  {!item.available && <span className="text-gray-400">• unavailable</span>}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button size="sm" variant="ghost" onClick={() => openEditItem(item, cat.id)}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => deleteItem(item.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                      <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => openAddItem(cat.id)}>
                        <Plus className="h-3 w-3 mr-2" />
                        {t.addMenuItem}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Category Dialog */}
      <Dialog open={catDialog.open} onOpenChange={open => setCatDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{catDialog.editing ? t.editCategory : t.addCategory}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="en">
            <TabsList className="w-full">
              <TabsTrigger value="en">EN</TabsTrigger>
              <TabsTrigger value="th">TH</TabsTrigger>
              <TabsTrigger value="zh">ZH</TabsTrigger>
              <TabsTrigger value="ja">JA</TabsTrigger>
              <TabsTrigger value="es">ES</TabsTrigger>
            </TabsList>
            {(['en', 'th', 'zh', 'ja', 'es'] as const).map(l => (
              <TabsContent key={l} value={l} className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label>{t[`name${l.charAt(0).toUpperCase() + l.slice(1)}` as keyof typeof t]}</Label>
                  <Input
                    value={catForm[`name${l.charAt(0).toUpperCase() + l.slice(1)}` as keyof typeof catForm] as string}
                    onChange={e => setCatForm(f => ({ ...f, [`name${l.charAt(0).toUpperCase() + l.slice(1)}`]: e.target.value }))}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <div className="space-y-2">
            <Label>{t.sortOrder}</Label>
            <Input type="number" value={catForm.sortOrder} onChange={e => setCatForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} className="w-24" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialog({ open: false })}>{t.cancel}</Button>
            <Button onClick={saveCat} disabled={catSaving}>{catSaving ? t.loading : t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={itemDialog.open} onOpenChange={open => setItemDialog(d => ({ ...d, open }))}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{itemDialog.editing ? t.editMenuItem : t.addMenuItem}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="en">
            <TabsList className="w-full">
              <TabsTrigger value="en">EN</TabsTrigger>
              <TabsTrigger value="th">TH</TabsTrigger>
              <TabsTrigger value="zh">ZH</TabsTrigger>
              <TabsTrigger value="ja">JA</TabsTrigger>
              <TabsTrigger value="es">ES</TabsTrigger>
            </TabsList>
            {(['en', 'th', 'zh', 'ja', 'es'] as const).map(l => {
              const cap = l.charAt(0).toUpperCase() + l.slice(1)
              return (
                <TabsContent key={l} value={l} className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label>{t[`name${cap}` as keyof typeof t]}</Label>
                    <Input
                      value={itemForm[`name${cap}` as keyof typeof itemForm] as string}
                      onChange={e => setItemForm(f => ({ ...f, [`name${cap}`]: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t[`desc${cap}` as keyof typeof t]}</Label>
                    <Textarea
                      value={itemForm[`desc${cap}` as keyof typeof itemForm] as string}
                      onChange={e => setItemForm(f => ({ ...f, [`desc${cap}`]: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.price}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={itemForm.price}
                onChange={e => setItemForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.sortOrder}</Label>
              <Input
                type="number"
                value={itemForm.sortOrder}
                onChange={e => setItemForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.imageUrl}</Label>
            <Input
              value={itemForm.imageUrl || ''}
              onChange={e => setItemForm(f => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://example.com/food.jpg"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={itemForm.hasSpicy}
                onCheckedChange={val => setItemForm(f => ({ ...f, hasSpicy: val }))}
              />
              <Label>{t.hasSpicy} 🌶️</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={itemForm.available}
                onCheckedChange={val => setItemForm(f => ({ ...f, available: val }))}
              />
              <Label>{t.available}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog({ open: false, categoryId: '' })}>{t.cancel}</Button>
            <Button onClick={saveItem} disabled={itemSaving}>{itemSaving ? t.loading : t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
