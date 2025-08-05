// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ClientProviders } from '@/components/ClientProviders'; // <<< RESTORED IMPORT

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Talea - Discover Tales Beyond Travel',
  description: 'Uncover hidden gems, create unique itineraries, and share your adventures.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ClientProviders WRAPPING children */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
