'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { adminTranslations, AdminLanguage } from '@/lib/translations'
import { Download, QrCode } from 'lucide-react'
import QRCode from 'react-qr-code'

interface QRCodeData {
  id: string
  qrUrl: string
  table: {
    tableNumber: number
    tableName: string | null
  }
}

function QRCardItem({ qr, t }: { qr: QRCodeData; t: Record<string, string> }) {
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQR = () => {
    if (!qrRef.current) return
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const size = 300
    canvas.width = size
    canvas.height = size + 50

    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
      ctx.fillStyle = '#111111'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Table ${qr.table.tableNumber}`, size / 2, size + 30)

      URL.revokeObjectURL(url)
      const link = document.createElement('a')
      link.download = `table-${qr.table.tableNumber}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = url
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {t.tableQR} #{qr.table.tableNumber}
          {qr.table.tableName && (
            <span className="text-muted-foreground font-normal ml-2">
              — {qr.table.tableName}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div ref={qrRef} className="bg-white p-4 rounded-lg border">
          <QRCode value={qr.qrUrl} size={180} />
        </div>
        <p className="text-xs text-muted-foreground text-center break-all">
          {t.scanToView}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={downloadQR}
        >
          <Download className="h-4 w-4 mr-2" />
          {t.downloadQR}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function QRCodesPage() {
  const { data: session } = useSession()
  const lang = (session?.user?.adminLang || 'EN') as AdminLanguage
  const t = adminTranslations[lang] || adminTranslations['EN']

  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/qrcodes')
      .then(r => r.json())
      .then(data => {
        setQrCodes(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.qrCodes}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.scanToView}
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t.loading}</p>
      ) : qrCodes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noQRCodes}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add tables first to generate QR codes automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {qrCodes.map(qr => (
            <QRCardItem key={qr.id} qr={qr} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}
