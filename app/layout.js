import './globals.css'

export const metadata = {
  title: 'Ace — Rebuilding From Zero',
  description: 'Burned out developer rebuilding everything at 32. Follow the journey.',
  openGraph: {
    title: 'Ace — Rebuilding From Zero',
    description: 'Burned out developer rebuilding everything at 32.',
    url: 'https://followace.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ace — Rebuilding From Zero',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
