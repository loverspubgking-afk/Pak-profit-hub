import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';

// Self-hosted Poppins (latin subset) so builds never depend on Google Fonts availability.
const poppins = localFont({
  src: [
    { path: './fonts/poppins-latin-300.woff2', weight: '300', style: 'normal' },
    { path: './fonts/poppins-latin-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/poppins-latin-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/poppins-latin-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/poppins-latin-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/poppins-latin-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Pak Profit Hub',
  description: 'Premium Pakistani daily earning and investment platform. Fixed-value plans with secure professional controls.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          theme="dark"
        />
      </body>
    </html>
  );
}
