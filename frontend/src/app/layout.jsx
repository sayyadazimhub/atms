import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: {
    template: '%s | ATMS',
    default: 'ATMS - Agriculture Trader Management System',
  },
  description: 'ATMS is an advanced agriculture management software designed to streamline crop trading, farmer management, buyer transactions, and agricultural business operations.',
  keywords: ['agriculture trading software', 'farmer management', 'crop trading', 'agriculture transaction management', 'buyer management'],
  metadataBase: new URL('https://atms.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ATMS - Agriculture Trader Management System',
    description: 'Digitize your agriculture trading business with ATMS. Manage inventory, sales, purchases, farmers, and buyers effectively.',
    url: 'https://atms.app',
    siteName: 'ATMS',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: 'ATMS - Agriculture Trader Management System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATMS - Agriculture Trader Management System',
    description: 'Digitize your agriculture trading business with ATMS.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <div className="max-w-[1700px] mx-auto min-h-screen relative">
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </div>
      </body>
    </html>
  );
}
