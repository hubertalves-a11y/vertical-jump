import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-hanken',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vertical Jump — Paraquedismo',
  description: 'Cada salto é desenhado em torno da sua segurança e da sua emoção.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={hanken.variable}>
      <body style={{ fontFamily: 'var(--font-hanken), system-ui, sans-serif' }}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
