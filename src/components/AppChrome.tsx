'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

interface AppChromeProps {
  children: React.ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  if (isLoginPage) {
    return <main className="min-h-full w-full">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <footer className="no-print bg-surface/50 border-t border-line/60 py-4 text-xs mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-2 text-muted">
            <span className="font-display font-semibold text-ink-soft tracking-wider text-xs uppercase">
              One Bohol For Good Governance (OBGG)
            </span>
            <span className="text-faint">•</span>
            <span className="text-muted text-[11.5px]">Official Portal Version 2.0</span>
          </div>
          <div className="text-muted/80 text-[11px]">
            Built for Institutional Governance, Transparency, and Service • Province of Bohol
          </div>
        </div>
      </footer>
    </>
  );
}
