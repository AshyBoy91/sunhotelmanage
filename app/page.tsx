'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sprout,
  QrCode,
  Languages,
  Flame,
  BarChart3,
  Smartphone,
  CheckCircle,
  Crown,
  Gift,
} from 'lucide-react'

type Lang = 'EN' | 'TH'

const t: Record<Lang, Record<string, string>> = {
  EN: {
    signIn: 'Sign In',
    getStarted: 'Get Started Free',
    badge: 'Digital Menu Platform for Restaurants',
    heroTitle1: 'Your Menu,',
    heroTitle2: ' One Scan Away',
    heroDesc: 'Create beautiful digital menus with QR codes for every table. Support 5 languages, spicy level selection, and manage everything from a simple admin panel.',
    startFree: 'Start Free Trial',
    signInBtn: 'Sign In',
    noCard: 'No credit card required',
    freeTrial: '1 month free trial',
    featuresTitle: 'Everything your restaurant needs',
    featuresDesc: 'A complete platform to digitize your menu and enhance the dining experience.',
    feat1Title: 'QR Code Menus',
    feat1Desc: 'Generate unique QR codes for each table. Customers scan to view your menu instantly.',
    feat2Title: '5 Languages',
    feat2Desc: 'Menu displayed in English, Thai, Chinese, Japanese, and Spanish — auto-detected from browser.',
    feat3Title: 'Spicy Level Selector',
    feat3Desc: 'Let customers choose their preferred spice level for each dish.',
    feat4Title: 'Easy Management',
    feat4Desc: 'Manage categories, menu items, tables and QR codes from one simple dashboard.',
    feat5Title: 'Mobile Optimized',
    feat5Desc: 'Beautiful, fast menus optimized for mobile devices — no app download needed.',
    feat6Title: 'Always Available',
    feat6Desc: 'Hosted on reliable infrastructure. Your menu is always accessible to customers.',
    howTitle: 'How it works',
    step1Title: 'Sign Up',
    step1Desc: 'Create your account and set up your restaurant profile in minutes.',
    step2Title: 'Add Your Menu',
    step2Desc: 'Add categories and menu items with names in 5 languages and prices.',
    step3Title: 'Share QR Codes',
    step3Desc: 'Print QR codes for each table. Customers scan to view your menu.',
    pricingTitle: 'Simple, transparent pricing',
    pricingDesc: 'Start free. Upgrade when you\'re ready.',
    freeTitle: 'Free Trial',
    freePrice: '0',
    freePeriod: '/first month',
    freeFeature1: 'Full access to all features',
    freeFeature2: 'Unlimited menu items & tables',
    freeFeature3: 'QR code generation',
    freeFeature4: '5 language support',
    freeCta: 'Start Free Trial',
    proTitle: 'Pro',
    proPrice: '200',
    proPeriod: '/month',
    proBadge: 'After trial',
    proFeature1: 'Everything in Free Trial',
    proFeature2: 'Continued access to all features',
    proFeature3: 'Priority support',
    proFeature4: 'No interruption of service',
    proCta: 'Start with Free Trial',
    ctaTitle: 'Ready to go digital?',
    ctaDesc: 'Join restaurants already using Sun\'s Bean Sprout to serve their customers better.',
    ctaCta: 'Create Your Menu — Free for 1 Month',
    copyright: "Sun's Bean Sprout. All rights reserved.",
  },
  TH: {
    signIn: 'เข้าสู่ระบบ',
    getStarted: 'เริ่มต้นฟรี',
    badge: 'แพลตฟอร์มเมนูดิจิทัลสำหรับร้านอาหาร',
    heroTitle1: 'เมนูของคุณ,',
    heroTitle2: ' แค่สแกนก็เห็น',
    heroDesc: 'สร้างเมนูดิจิทัลสวยงามพร้อม QR code สำหรับทุกโต๊ะ รองรับ 5 ภาษา เลือกระดับความเผ็ดได้ จัดการทุกอย่างจากแผงควบคุมง่ายๆ',
    startFree: 'เริ่มทดลองใช้ฟรี',
    signInBtn: 'เข้าสู่ระบบ',
    noCard: 'ไม่ต้องใช้บัตรเครดิต',
    freeTrial: 'ทดลองใช้ฟรี 1 เดือน',
    featuresTitle: 'ทุกสิ่งที่ร้านอาหารของคุณต้องการ',
    featuresDesc: 'แพลตฟอร์มครบวงจรเพื่อทำเมนูดิจิทัลและยกระดับประสบการณ์การรับประทานอาหาร',
    feat1Title: 'เมนู QR Code',
    feat1Desc: 'สร้าง QR code สำหรับแต่ละโต๊ะ ลูกค้าสแกนดูเมนูได้ทันที',
    feat2Title: '5 ภาษา',
    feat2Desc: 'เมนูแสดงเป็นภาษาอังกฤษ ไทย จีน ญี่ปุ่น และสเปน — ตรวจจับอัตโนมัติจากเบราว์เซอร์',
    feat3Title: 'เลือกระดับความเผ็ด',
    feat3Desc: 'ให้ลูกค้าเลือกระดับความเผ็ดที่ต้องการสำหรับแต่ละเมนู',
    feat4Title: 'จัดการง่าย',
    feat4Desc: 'จัดการหมวดหมู่ เมนูอาหาร โต๊ะ และ QR code จากแดชบอร์ดเดียว',
    feat5Title: 'รองรับมือถือ',
    feat5Desc: 'เมนูสวยงาม โหลดเร็ว ออกแบบสำหรับมือถือ — ไม่ต้องดาวน์โหลดแอป',
    feat6Title: 'ใช้งานได้ตลอด',
    feat6Desc: 'โฮสต์บนเซิร์ฟเวอร์ที่เสถียร เมนูของคุณพร้อมให้ลูกค้าเข้าถึงเสมอ',
    howTitle: 'ขั้นตอนการใช้งาน',
    step1Title: 'สมัครสมาชิก',
    step1Desc: 'สร้างบัญชีและตั้งค่าร้านอาหารของคุณภายในไม่กี่นาที',
    step2Title: 'เพิ่มเมนู',
    step2Desc: 'เพิ่มหมวดหมู่และรายการอาหารพร้อมชื่อใน 5 ภาษาและราคา',
    step3Title: 'แชร์ QR Code',
    step3Desc: 'พิมพ์ QR code สำหรับแต่ละโต๊ะ ลูกค้าสแกนเพื่อดูเมนู',
    pricingTitle: 'ราคาเรียบง่าย โปร่งใส',
    pricingDesc: 'เริ่มต้นฟรี อัปเกรดเมื่อคุณพร้อม',
    freeTitle: 'ทดลองฟรี',
    freePrice: '0',
    freePeriod: '/เดือนแรก',
    freeFeature1: 'เข้าถึงทุกฟีเจอร์',
    freeFeature2: 'เมนูและโต๊ะไม่จำกัด',
    freeFeature3: 'สร้าง QR code',
    freeFeature4: 'รองรับ 5 ภาษา',
    freeCta: 'เริ่มทดลองใช้ฟรี',
    proTitle: 'โปร',
    proPrice: '200',
    proPeriod: '/เดือน',
    proBadge: 'หลังทดลอง',
    proFeature1: 'ทุกอย่างในแพ็กทดลอง',
    proFeature2: 'ใช้งานฟีเจอร์ทั้งหมดต่อเนื่อง',
    proFeature3: 'ซัพพอร์ตเร็วกว่า',
    proFeature4: 'ไม่มีการหยุดชะงักการใช้งาน',
    proCta: 'เริ่มทดลองฟรีก่อน',
    ctaTitle: 'พร้อมเปลี่ยนสู่ดิจิทัลหรือยัง?',
    ctaDesc: "เข้าร่วมร้านอาหารที่ใช้ Sun's Bean Sprout เพื่อบริการลูกค้าได้ดียิ่งขึ้น",
    ctaCta: 'สร้างเมนูของคุณ — ฟรี 1 เดือน',
    copyright: "Sun's Bean Sprout สงวนลิขสิทธิ์",
  },
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('EN')
  const s = t[lang]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0].toUpperCase()
      if (browserLang === 'TH') setLang('TH')
    }
  }, [])

  const features = [
    { icon: QrCode, title: s.feat1Title, description: s.feat1Desc },
    { icon: Languages, title: s.feat2Title, description: s.feat2Desc },
    { icon: Flame, title: s.feat3Title, description: s.feat3Desc },
    { icon: BarChart3, title: s.feat4Title, description: s.feat4Desc },
    { icon: Smartphone, title: s.feat5Title, description: s.feat5Desc },
    { icon: CheckCircle, title: s.feat6Title, description: s.feat6Desc },
  ]

  const steps = [
    { step: '1', title: s.step1Title, desc: s.step1Desc },
    { step: '2', title: s.step2Title, desc: s.step2Desc },
    { step: '3', title: s.step3Title, desc: s.step3Desc },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-green-700">
            <div className="bg-green-600 text-white rounded-lg p-1.5">
              <Sprout className="h-5 w-5" />
            </div>
            Sun&apos;s Bean Sprout
          </div>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-0.5">
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  lang === 'EN' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('TH')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  lang === 'TH' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                TH
              </button>
            </div>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">{s.signIn}</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">{s.getStarted}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sprout className="h-4 w-4" />
            {s.badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            {s.heroTitle1}
            <span className="text-green-600">{s.heroTitle2}</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {s.heroDesc}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 text-base bg-green-600 hover:bg-green-700">
                {s.startFree}
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-8 text-base">
                {s.signInBtn}
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {s.noCard} &bull; {s.freeTrial}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">{s.featuresTitle}</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">{s.featuresDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-green-100 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">{s.howTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">{s.pricingTitle}</h2>
            <p className="mt-3 text-gray-500">{s.pricingDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Trial Card */}
            <Card className="border-2 border-green-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500" />
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-lg text-gray-900">{s.freeTitle}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{s.freePrice}</span>
                  <span className="text-lg font-semibold text-gray-900">&nbsp;฿</span>
                  <span className="text-muted-foreground ml-1">{s.freePeriod}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[s.freeFeature1, s.freeFeature2, s.freeFeature3, s.freeFeature4].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {s.freeCta}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Card */}
            <Card className="border-2 border-orange-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-orange-500" />
                  <h3 className="font-bold text-lg text-gray-900">{s.proTitle}</h3>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    {s.proBadge}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{s.proPrice}</span>
                  <span className="text-lg font-semibold text-gray-900">&nbsp;฿</span>
                  <span className="text-muted-foreground ml-1">{s.proPeriod}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[s.proFeature1, s.proFeature2, s.proFeature3, s.proFeature4].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
                    {s.proCta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{s.ctaTitle}</h2>
          <p className="text-green-100 mb-8 text-lg">{s.ctaDesc}</p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-10 text-base font-semibold">
              {s.ctaCta}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-600 font-semibold">
            <Sprout className="h-5 w-5 text-green-600" />
            Sun&apos;s Bean Sprout
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {s.copyright}
          </p>
        </div>
      </footer>
    </div>
  )
}
