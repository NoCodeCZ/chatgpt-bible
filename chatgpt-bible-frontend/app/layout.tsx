import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Providers from '@/components/providers/Providers'
import { getNavigationItems } from '@/lib/services/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'GPT Bible - ปลดล็อกพลังของ AI ด้วย Prompts คุณภาพสูง',
  description: 'รวบรวม prompts ที่ได้มาจากผู้สร้างและบุคคลมืออาชีพจากทั่วโลก',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch navigation items from Directus
  const navItems = await getNavigationItems()

  return (
    <html lang="th" className="bg-black">
      <body className="antialiased bg-black text-white">
        <Script
          src="https://code.iconify.design/3/3.1.0/iconify.min.js"
          strategy="afterInteractive"
        />
        <Providers>
          <Navbar items={navItems} />
          <main className="relative">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
