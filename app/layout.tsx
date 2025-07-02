import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Career Mini App',
  description: 'Карьерное приложение для развития профессиональных навыков',
  generator: 'Telegram Mini App',
  viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />

      </head>
      <body>{children}</body>
    </html>
  )
}
