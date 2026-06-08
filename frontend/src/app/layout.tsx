import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import Providers from './providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EthioJobs Hub - Find Your Dream Job in Ethiopia',
  description:
    'EthioJobs Hub connects Ethiopian job seekers with top employers. Browse thousands of job listings, submit applications, and advance your career.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Providers>
          {children}
          <Toaster richColors position="top-right" theme="system" />
        </Providers>
      </body>
    </html>
  );
}
