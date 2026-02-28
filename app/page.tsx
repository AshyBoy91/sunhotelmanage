import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChefHat,
  QrCode,
  Languages,
  Flame,
  BarChart3,
  Smartphone,
  CheckCircle,
} from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: 'QR Code Menus',
    description: 'Generate unique QR codes for each table. Customers scan to view your menu instantly.',
  },
  {
    icon: Languages,
    title: '5 Languages',
    description: 'Menu displayed in English, Thai, Chinese, Japanese, and Spanish — auto-detected from browser.',
  },
  {
    icon: Flame,
    title: 'Spicy Level Selector',
    description: 'Let customers choose their preferred spice level for each dish.',
  },
  {
    icon: BarChart3,
    title: 'Easy Management',
    description: 'Manage categories, menu items, tables and QR codes from one simple dashboard.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Beautiful, fast menus optimized for mobile devices — no app download needed.',
  },
  {
    icon: CheckCircle,
    title: 'Always Available',
    description: 'Hosted on reliable infrastructure. Your menu is always accessible to customers.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-orange-600">
            <div className="bg-orange-500 text-white rounded-lg p-1.5">
              <ChefHat className="h-5 w-5" />
            </div>
            MenuQR
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Flame className="h-4 w-4" />
            Digital Menu Platform for Restaurants
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Your Menu,
            <span className="text-orange-500"> One Scan Away</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Create beautiful digital menus with QR codes for every table. Support 5 languages,
            spicy level selection, and manage everything from a simple admin panel.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 text-base">
                Start for Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-8 text-base">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free to get started
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything your restaurant needs
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              A complete platform to digitize your menu and enhance the dining experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
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
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account and set up your restaurant profile in minutes.' },
              { step: '2', title: 'Add Your Menu', desc: 'Add categories and menu items with names in 5 languages and prices.' },
              { step: '3', title: 'Share QR Codes', desc: 'Print QR codes for each table. Customers scan to view your menu.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to go digital?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join restaurants already using MenuQR to serve their customers better.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-10 text-base font-semibold">
              Create Your Menu — Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-600 font-semibold">
            <ChefHat className="h-5 w-5 text-orange-500" />
            MenuQR
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MenuQR. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
