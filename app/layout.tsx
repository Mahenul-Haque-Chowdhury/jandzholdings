import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  preload: false,
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  preload: false,
});

export const metadata: Metadata = {
  title: 'J&Z Holdings Ltd | Real Estate Developer in Bangladesh',
  description: 'J&Z Holdings Ltd - a real estate developer in Bangladesh building sustainable, affordable residential and commercial spaces.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head></head>
      <body className="font-sans antialiased text-white selection:bg-zinc-800" suppressHydrationWarning>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
