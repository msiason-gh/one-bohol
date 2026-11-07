import type { Metadata } from 'next';
import './globals.css';
import { MemberProvider } from '@/context/MemberContext';
import { AlertProvider } from '@/context/AlertContext';
import { AppChrome } from '@/components/AppChrome';
import { DigitalIdModal } from '@/components/DigitalIdModal';

export const metadata: Metadata = {
  title: 'One Bohol For Good Governance (OBGG) | Official Member Portal & Command Center',
  description:
    'Institutional membership registry, analytics command center, and registration portal for One Bohol For Good Governance.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
        <AlertProvider>
          <MemberProvider>
            <AppChrome>
              {children}
            </AppChrome>
            <DigitalIdModal />
          </MemberProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
