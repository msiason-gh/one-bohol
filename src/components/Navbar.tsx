'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMembers } from '@/context/MemberContext';
import { useAlert } from '@/context/AlertContext';
import { OneBoholLogo } from '@/components/OneBoholLogo';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  RotateCcw, 
  LogOut, 
  Database,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    backendMode, 
    isSyncing, 
    resetToSeedData, 
    members, 
    logout 
  } = useMembers();
  const { showConfirm } = useAlert();

  const handleReset = async () => {
    const confirmed = await showConfirm(
      'Reset database to the 200 pre-seeded members? All newly registered members will be reset.',
      {
        title: 'Reset Membership Registry',
        type: 'warning',
        confirmText: 'Reset Database',
        cancelText: 'Cancel',
      }
    );
    if (confirmed) {
      await resetToSeedData();
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { href: '/members', label: 'Member Directory', icon: Users },
    { href: '/register', label: 'Register Member', icon: UserPlus },
  ];

  return (
    <header className="sticky top-0 z-40 w-full no-print">
      {/* Subtle 3-Pixel Philippine Tricolor Top Accent */}
      <div className="flex h-[3px] w-full">
        <div className="w-1/3 bg-[#0038A8]" title="Royal Blue" />
        <div className="w-1/3 bg-[#CE1126]" title="Crimson Red" />
        <div className="w-1/3 bg-[#FCD116]" title="Golden Yellow" />
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <div className="bg-background/90 backdrop-blur-md border-b border-line px-4 lg:px-8 py-2.5 transition-all">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand & Logo */}
          <Link href="/dashboard" className="flex items-center group py-0.5 hover:opacity-90 transition-opacity">
            <OneBoholLogo className="w-[135px] sm:w-[155px]" />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center flex-wrap gap-1 bg-surface-sunk/60 p-1 rounded-sm border border-line/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-xs transition-all ${
                    isActive
                      ? 'bg-background text-primary-deep shadow-flat border border-line/80 font-bold'
                      : 'text-ink-soft hover:text-ink hover:bg-surface'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* System Status & Admin Actions */}
          <div className="flex items-center space-x-2.5 text-xs">
            {/* Backend Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-surface rounded-xs border border-line text-[11px] text-ink-soft">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono font-medium">
                {backendMode === 'SUPABASE_LIVE' ? 'Supabase Postgres' : 'Local Demo'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendMode === 'SUPABASE_LIVE' ? 'bg-success' : 'bg-warning'
                } animate-pulse`}
              />
            </div>

            {isSyncing && (
              <span className="flex items-center space-x-1 text-primary text-[11px]">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Syncing</span>
              </span>
            )}

            {/* Roster Badge */}
            <Badge variant="neutral" className="font-mono">
              Roster: {members.length}
            </Badge>

            {/* Reset Seed Button */}
            <button
              onClick={handleReset}
              title="Reset to 200 pre-seeded members"
              className="p-1.5 text-muted hover:text-ink hover:bg-surface rounded-xs border border-line transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Exit Session */}
            <button
              onClick={handleLogout}
              title="Exit Admin Session"
              className="p-1.5 text-error/80 hover:text-error hover:bg-error/10 rounded-xs border border-error/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
