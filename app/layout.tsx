import type { Metadata, Viewport } from 'next'
import { Inter, Special_Elite } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _specialElite = Special_Elite({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shadows of Tehran | Interactive Noir',
  description: 'An interactive storytelling game set in 1940s Tehran. Navigate the shadowy streets and uncover the truth.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1408',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
