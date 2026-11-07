'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMembers } from '@/context/MemberContext';
import { OneBoholLogo } from '@/components/OneBoholLogo';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginDemoAdmin } = useMembers();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerLogin = () => {
    setInfoNotice(null);
    setIsSubmitting(true);

    if (rememberMe && email.trim() && typeof window !== 'undefined') {
      localStorage.setItem('obgg_remember_email', email.trim());
    }

    loginDemoAdmin();
    setTimeout(() => {
      router.push('/dashboard');
    }, 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerLogin();
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setInfoNotice(
      'Password reset is managed by the OBGG Secretariat. Please contact the Provincial IT Administrator.'
    );
  };

  const handleContactAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    setInfoNotice(
      'For account provisioning or credential assistance, contact secretariat@onebohol.org.'
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center py-8 sm:py-12 bg-[#F8FAFC] select-none">
      {/* Wrapper ensuring the top portion of the hero emblem is never cut off,
          with the complete circular seal framing the login card. */}
      <div className="relative flex flex-col items-center w-full max-w-[375px] sm:max-w-[390px] px-4">
        {/* Complete Circular Hero Emblem */}
        <div className="pointer-events-none relative z-10 w-[540px] sm:w-[620px] md:w-[690px] aspect-square -mb-[250px] sm:-mb-[290px] md:-mb-[325px] opacity-[0.52]">
          <Image
            src="/brand/obgg-emblem-hero.png"
            alt="One Bohol For Good Governance Emblem"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>

        {/* White Login Form Card */}
        <div className="relative z-20 w-full bg-white rounded-[16px] shadow-[0_18px_50px_rgba(11,32,39,0.12)] border border-slate-200/80 px-6 sm:px-7 pt-5 pb-5">
          <div className="flex flex-col items-center mb-4">
            <OneBoholLogo className="w-[175px] sm:w-[190px]" />
          </div>

          {infoNotice && (
            <div className="mb-3.5 p-2.5 bg-[#F0FDF4] border border-emerald-200 rounded-[8px] text-[#0B4619] text-[11.5px] leading-snug text-center">
              {infoNotice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Address Input */}
            <div>
              <label htmlFor="login-email" className="sr-only">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[#526574]">
                  <svg
                    viewBox="0 0 20 16"
                    fill="currentColor"
                    className="w-[16px] h-[13px]"
                  >
                    <path d="M2 0C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0H2ZM18 3.8L10 8.8L2 3.8V2L10 7L18 2V3.8Z" />
                  </svg>
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-[43px] pl-10 pr-4 bg-[#FAFBFD] border border-[#DCE4EC] rounded-[9px] text-[13px] font-medium text-slate-800 placeholder-[#647A89] focus:outline-hidden focus:bg-white focus:border-[#057874] focus:ring-2 focus:ring-[#057874]/15 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="login-password" className="sr-only">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[#526574]">
                  <svg
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    className="w-[14px] h-[16px]"
                  >
                    <path d="M14 7H13V5C13 2.24 10.76 0 8 0C5.24 0 3 2.24 3 5V7H2C0.9 7 0 7.9 0 9V18C0 19.1 0.9 20 2 20H14C15.1 20 16 19.1 16 18V9C16 7.9 15.1 7 14 7ZM8 15C6.9 15 6 14.1 6 13C6 11.9 6.9 11 8 11C9.1 11 10 11.9 10 13C10 14.1 9.1 15 8 15ZM5 7V5C5 3.34 6.34 2 8 2C9.66 2 11 3.34 11 5V7H5Z" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-[43px] pl-10 pr-10 bg-[#FAFBFD] border border-[#DCE4EC] rounded-[9px] text-[13px] font-medium text-slate-800 placeholder-[#647A89] focus:outline-hidden focus:bg-white focus:border-[#057874] focus:ring-2 focus:ring-[#057874]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 flex items-center text-[#526574] hover:text-slate-800 focus:outline-hidden cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <Eye className="w-[17px] h-[17px]" />
                  ) : (
                    <EyeOff className="w-[17px] h-[17px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password? */}
            <div className="flex items-center justify-between pt-0.5 pb-1">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center space-x-2 text-[#475569] cursor-pointer focus:outline-hidden"
              >
                <span
                  className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center transition-colors ${
                    rememberMe
                      ? 'bg-[#057874] border-[#057874] text-white'
                      : 'bg-white border-[#CBD5E1]'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span className="text-[12px] font-medium text-[#4A5D6B]">
                  Remember me
                </span>
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[12px] font-semibold text-[#0C7A68] hover:text-[#065F50] underline underline-offset-2 cursor-pointer focus:outline-hidden"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[44px] flex items-center justify-center space-x-2 rounded-full bg-brand-gradient hover:brightness-105 text-white font-semibold text-[14px] shadow-flat hover:shadow-raised transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-[16px] h-[16px] stroke-[2.2]" />
              </button>
            </div>
          </form>

          {/* Footer Line */}
          <div className="text-center mt-3.5 pt-0.5">
            <p className="text-[11.5px] font-medium text-[#4A5D6B]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={handleContactAdmin}
                className="font-semibold text-[#0C7A68] hover:text-[#065F50] underline underline-offset-2 cursor-pointer focus:outline-hidden"
              >
                Contact Administrator
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
