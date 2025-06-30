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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // GitHub Pages SPA support
              (function(l) {
                if (l.search[1] === '/' ) {
                  var decoded = l.search.slice(1).split('&').map(function(s) { 
                    return s.replace(/~and~/g, '&')
                  }).join('?');
                  var basePath = '/miniapp';
                  var newPath = basePath + decoded;
                  window.history.replaceState(null, null, newPath + l.hash);
                }
              }(window.location))
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
