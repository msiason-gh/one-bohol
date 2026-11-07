'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMembers } from '@/context/MemberContext';
import { 
  Users, 
  UserPlus,
  Award, 
  ShieldCheck, 
  MapPin, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Layers,
  ChevronRight, 
  HeartHandshake,
  Newspaper
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LabelList,
  CartesianGrid
} from 'recharts';

// Lighter, luminous GovTech palette for dashboard visualization widgets
const ROLE_COLORS = [
  '#14B8A6', // Vibrant Light Teal (General Member / Volunteer)
  '#38BDF8', // Fresh Sky Blue (Barangay Leader)
  '#34D399', // Light Emerald / Mint (Municipal / City Coordinator)
  '#FBBF24', // Warm Light Amber (Provincial Coordinator)
  '#A78BFA', // Soft Lavender / Violet (Regional Coordinator)
  '#FB7185', // Soft Rose Coral (National / Executive Officer)
];

const SECTOR_COLORS = [
  '#14B8A6', // REKOM Alliance: Light Vibrant Teal
  '#2DD4BF', // Transport & Labor: Fresh Aqua Mint
  '#38BDF8', // Farmers & Fisherfolk: Light Sky Blue
  '#60A5FA', // Overseas / OFW: Soft Azure Blue
  '#34D399', // Business & Private: Light Emerald Mint
  '#FBBF24', // Women's Sector: Soft Warm Gold
  '#A78BFA', // Senior Citizens & PWD: Light Lilac Lavender
  '#FB7185', // Youth & Students: Soft Light Coral
];

export default function DashboardPage() {
  const { members } = useMembers();
  const [geoView, setGeoView] = useState<'BOHOL' | 'NATIONAL'>('BOHOL');

  // KPI Calculations
  const totalCount = members.length;
  const verifiedCount = members.filter((m) => m.status === 'VERIFIED').length;
  const verifiedPercentage = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
  const pendingCount = members.filter((m) => m.status === 'PENDING').length;
  const distinctLGUs = useMemo(() => {
    return new Set(members.map((m) => m.municipality)).size;
  }, [members]);

  // Chart 1: Geographic Distribution
  const geoChartData = useMemo(() => {
    if (geoView === 'BOHOL') {
      const boholMembers = members.filter((m) => m.province === 'Bohol');
      const topMunis: Record<string, number> = {};
      boholMembers.forEach((m) => {
        topMunis[m.municipality] = (topMunis[m.municipality] || 0) + 1;
      });
      return Object.entries(topMunis)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }));
    } else {
      const counts: Record<string, number> = {};
      members.forEach((m) => {
        const shortName = m.region.replace(/\(.*\)/, '').trim();
        counts[shortName] = (counts[shortName] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }));
    }
  }, [members, geoView]);

  // Chart 2: Organizational Role Breakdown (Donut)
  const roleChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      counts[m.role] = (counts[m.role] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
      }));
  }, [members]);

  // Chart 3: Sectoral / Alliance Group Breakdown (Horizontal Bar)
  const sectorChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      counts[m.sector] = (counts[m.sector] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name: name.replace('Sector', '').replace('Chapter', '').trim(),
        fullName: name,
        count,
      }));
  }, [members]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* =========================================================================
          TOP BANNER: Official Organizational Profile & Description (Exact Match to Image 2)
          ========================================================================= */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#CBEFE3] px-6 py-6 sm:px-8 sm:py-6 shadow-[0_2px_12px_rgba(14,158,143,0.06)] min-h-[180px] flex items-center bg-cover bg-center bg-no-repeat md:bg-[length:100%_100%]"
        style={{
          backgroundImage: "url('/brand/obgg-banner-bg.png?v=2')",
          backgroundColor: '#ECFAF5',
        }}
      >
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left Text & Badges Content */}
          <div className="space-y-2.5 max-w-[615px]">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#CCF4E8] text-[#095C47]">
                <Newspaper className="w-3.5 h-3.5 text-[#0D946B] shrink-0" />
                <span>NON-PROFIT ORGANISATION</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#CCF4E8] text-[#095C47]">
                <HeartHandshake className="w-3.5 h-3.5 text-[#0D946B] shrink-0" />
                <span>ALLIANCE WITH REKOM</span>
              </span>

              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#233842] bg-white/75 backdrop-blur-[2px]">
                <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>Province of Bohol</span>
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#0B2027] tracking-tight leading-[1.2]">
              One Bohol For Good Governance
            </h1>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-[14px] text-[#2E4450] font-medium leading-[1.52]">
              One Bohol for Good Governance is a volunteer group composed, created, and managed by sectoral and private groups that have a strong alliance with REKOM in Bohol aiming for good governance in the Province.
            </p>
          </div>

          {/* Right Action Buttons (Stacked Wide Rounded-XL Buttons) */}
          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto relative z-20">
            <Link
              href="/members"
              className="inline-flex items-center justify-center space-x-2.5 px-6 py-3 bg-white hover:bg-[#F9FEFC] text-[#142934] font-bold text-xs sm:text-[14px] rounded-xl border border-white shadow-[0_2px_8px_rgba(10,34,48,0.06)] transition-all w-full sm:w-[215px]"
            >
              <Users className="w-[18px] h-[18px] text-[#223B4B] shrink-0" />
              <span>Member Directory</span>
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center space-x-2.5 px-6 py-3 text-white font-bold text-xs sm:text-[14px] rounded-xl shadow-flat hover:shadow-raised bg-brand-gradient hover:brightness-105 transition-all w-full sm:w-[215px]"
            >
              <UserPlus className="w-[18px] h-[18px] text-white shrink-0" />
              <span>Register Member</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Real-Time State Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-line">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight">
            Command Center Overview
          </h2>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: 4 KPI Cards (Pixel-Accurate to Reference Image)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: TOTAL MEMBERS (Matches White Card Theme of Other Cards) */}
        <div className="rounded-2xl bg-white border border-line p-5 sm:p-6 shadow-sm hover:shadow-raised transition-shadow flex flex-col justify-between min-h-[148px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#E8F8F2] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-[#16A34A]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                  TOTAL MEMBERS
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-display text-ink mt-0.5 tracking-tight">
                  {totalCount}
                </div>
              </div>
            </div>

            <Link
              href="/members"
              className="w-7 h-7 rounded-full bg-surface hover:bg-surface-sunk flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0"
              title="View members"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-line flex items-center space-x-1.5 text-xs font-medium">
            <span className="text-[#16A34A] font-bold">↑ +12%</span>
            <span className="text-muted">vs. last month</span>
          </div>
        </div>

        {/* Card 2: VERIFIED CREDENTIALS */}
        <div className="rounded-2xl bg-white border border-line p-5 sm:p-6 shadow-sm hover:shadow-raised transition-shadow flex flex-col justify-between min-h-[148px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#E8F8F2] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#16A34A]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                  VERIFIED CREDENTIALS
                </div>
                <div className="flex items-baseline space-x-2.5 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                    {verifiedCount}
                  </span>
                  <span className="bg-[#D8F5E9] text-[#16A34A] text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full tracking-wider">
                    {verifiedPercentage}% COMPLETED
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/members?status=VERIFIED"
              className="w-7 h-7 rounded-full bg-surface hover:bg-surface-sunk flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0"
              title="View verified members"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-line text-[11px] text-muted truncate">
            Official PVC digital IDs issued and validated
          </div>
        </div>

        {/* Card 3: PENDING VERIFICATION */}
        <div className="rounded-2xl bg-white border border-line p-5 sm:p-6 shadow-sm hover:shadow-raised transition-shadow flex flex-col justify-between min-h-[148px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#E8F8F2] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                  PENDING VERIFICATION
                </div>
                <div className="flex items-baseline space-x-2.5 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                    {pendingCount}
                  </span>
                  <Link
                    href="/members?status=PENDING"
                    className="bg-[#FEF3D6] text-[#D97706] hover:bg-[#FDE68A] text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors flex items-center space-x-0.5"
                  >
                    <span>Review</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/members?status=PENDING"
              className="w-7 h-7 rounded-full bg-surface hover:bg-surface-sunk flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0"
              title="Review pending members"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-line text-[11px] text-muted truncate">
            Awaiting secretariat validation and ID badge
          </div>
        </div>

        {/* Card 4: MUNICIPAL SCOPE */}
        <div className="rounded-2xl bg-white border border-line p-5 sm:p-6 shadow-sm hover:shadow-raised transition-shadow flex flex-col justify-between min-h-[148px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#E8F8F2] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-[#16A34A]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                  MUNICIPAL SCOPE
                </div>
                <div className="flex items-baseline space-x-2.5 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                    {distinctLGUs}
                  </span>
                  <span className="bg-[#D8F5F2] text-[#0A6273] text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    BOHOL COVERAGE
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/members"
              className="w-7 h-7 rounded-full bg-surface hover:bg-surface-sunk flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0"
              title="View all coverage"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-line text-[11px] text-muted truncate">
            Municipalities and component cities active
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 2: 3 Analytics Visualizations (Exact Layout from Image)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: GEOGRAPHIC DISTRIBUTION (Vertical Bar Chart with Labels) */}
        <div className="rounded-2xl bg-white border border-line p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-[13px] uppercase tracking-wider text-ink">
                  GEOGRAPHIC DISTRIBUTION
                </h3>
              </div>
              <div className="flex rounded-lg bg-surface border border-line p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setGeoView('BOHOL')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    geoView === 'BOHOL'
                      ? 'bg-brand-gradient text-white shadow-xs font-semibold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Bohol LGUs
                </button>
                <button
                  onClick={() => setGeoView('NATIONAL')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    geoView === 'NATIONAL'
                      ? 'bg-brand-gradient text-white shadow-xs font-semibold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Regions
                </button>
              </div>
            </div>
            
            <p className="text-xs text-muted mt-2 mb-4">
              {geoView === 'BOHOL'
                ? 'Top Bohol Municipalities by active member count'
                : 'National alliance distribution across Philippine regions'}
            </p>

            <div className="h-64 mt-2 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoChartData} margin={{ top: 25, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F7" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    tick={{ fontSize: 9.5, fill: '#5C7480', fontWeight: 500 }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#5C7480' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2EBED',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(11, 32, 39, 0.08)',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" fill="#14B8A6" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    <LabelList
                      dataKey="count"
                      position="top"
                      fill="#14B8A6"
                      fontSize={11}
                      fontWeight="bold"
                      dy={-4}
                    />
                    {geoChartData.map((_, index) => (
                      <Cell key={`geo-cell-${index}`} fill={index === 0 ? '#14B8A6' : '#2DD4BF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-line text-[10px] text-muted text-center font-mono">
            {geoView === 'BOHOL' ? 'Tagbilaran City & District Municipalities' : 'National Party-List Footprint'}
          </div>
        </div>

        {/* Chart 2: ORGANIZATIONAL HIERARCHY (Donut Chart with 200 Total & Side Legend) */}
        <div className="rounded-2xl bg-white border border-line p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-line">
              <PieChartIcon className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-[13px] uppercase tracking-wider text-ink">
                ORGANIZATIONAL HIERARCHY
              </h3>
            </div>
            <p className="text-xs text-muted mt-2 mb-4">
              Breakdown by leadership designation and field roles
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 pt-2">
              {/* Left Donut with Center Text */}
              <div className="md:col-span-6 relative flex items-center justify-center">
                <div className="w-full h-56 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={84}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {roleChartData.map((_, index) => (
                          <Cell key={`role-cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E2EBED',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(11, 32, 39, 0.08)',
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Total Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold font-display text-ink leading-tight tracking-tight">
                      {totalCount}
                    </span>
                    <span className="text-[11px] text-muted font-medium">Total</span>
                  </div>
                </div>
              </div>

              {/* Right Side-by-Side Clean Legend */}
              <div className="md:col-span-6 space-y-2.5 pl-1">
                {roleChartData.map((item, index) => {
                  const pct = totalCount > 0 ? Math.round((item.value / totalCount) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length] }}
                        />
                        <span className="text-ink font-medium truncate" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                      <span className="font-semibold text-ink pl-2 shrink-0">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-line text-[10px] text-muted text-center font-mono">
            Total {totalCount} active leadership officers
          </div>
        </div>

        {/* Chart 3: SECTORAL & ALLIANCE GROUPS (Horizontal Bar Chart with End Labels) */}
        <div className="rounded-2xl bg-white border border-line p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-line">
              <Layers className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-[13px] uppercase tracking-wider text-ink">
                SECTORAL & ALLIANCE GROUPS
              </h3>
            </div>
            <p className="text-xs text-muted mt-2 mb-4">
              Representation across all 8 strategic allied chapters
            </p>

            <div className="h-64 mt-2 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 35, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F7" />
                  <XAxis type="number" tick={{ fontSize: 9.5, fill: '#5C7480' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 9.5, fill: '#33474F', fontWeight: 500 }}
                    width={115}
                  />
                  <Tooltip
                    formatter={(val, name, item) => {
                      const payload = item.payload as { fullName?: string };
                      return [val, payload.fullName || String(name)];
                    }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2EBED',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(11, 32, 39, 0.08)',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                    <LabelList
                      dataKey="count"
                      position="right"
                      fill="#0B2027"
                      fontSize={11}
                      fontWeight="bold"
                      dx={6}
                    />
                    {sectorChartData.map((_, index) => (
                      <Cell key={`sector-cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-line text-[10px] text-muted text-center font-mono">
            REKOM Alliance, Farmers, Youth, Fisherfolk & OFWs
          </div>
        </div>

      </div>

    </div>
  );
}
