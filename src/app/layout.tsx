import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'A11yLab',
  description: 'Accessibility testing platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-900 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  )
}
