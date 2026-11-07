'use client';

import React from 'react';
import Image from 'next/image';
import { useMembers } from '@/context/MemberContext';
import { 
  X, 
  Printer, 
  MapPin,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { StatusBadge, Button } from '@/components/ui';
import { OneBoholLogo } from '@/components/OneBoholLogo';

// Generates a formal 21x21 QR Code visual matrix pattern deterministically from ID
function SvgQrCode({ code }: { code: string }) {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(14, 0); // Top-right
  drawFinder(0, 14); // Bottom-left

  // Timing lines
  for (let i = 8; i < 13; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) % 1000000;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= 13) ||
        (r >= 13 && c < 8)
      ) {
        continue;
      }
      hash = (hash * 1103515245 + 12345) & 0x7fffffff;
      if (hash % 3 === 0) {
        grid[r][c] = true;
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-24 h-24 bg-white p-1.5 border border-[#CBEFE3] rounded-[8px] shadow-[0_1px_3px_rgba(9,92,71,0.05)]"
    >
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#095C47" /> : null
        )
      )}
    </svg>
  );
}

export function DigitalIdModal() {
  const { selectedMemberForId, closeIdModal, verifyMember } = useMembers();

  if (!selectedMemberForId) return null;

  const member = selectedMemberForId;

  const handlePrint = () => {
    window.print();
  };

  const isPending = member.status === 'PENDING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2027]/45 backdrop-blur-[3px] overflow-y-auto no-print">
      <div 
        className="relative w-full max-w-[680px] bg-white border border-[#DCEAE6] rounded-2xl shadow-[0_24px_60px_rgba(11,32,39,0.16)] overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Window Header (Logo removed from left as requested) */}
        <div className="no-print bg-white px-6 sm:px-7 py-4 flex items-center justify-between border-b border-[#E5EFEA]">
          <div>
            <h3 className="font-display text-[15px] sm:text-base font-bold text-[#0B2027] tracking-tight">
              Official PVC Identification Card
            </h3>
            <p className="text-xs text-[#5C7480] font-medium mt-0.5">
              One Bohol For Good Governance • Secretariat Registry
            </p>
          </div>
          <button
            onClick={closeIdModal}
            className="w-8 h-8 flex items-center justify-center text-[#5C7480] hover:text-[#0B2027] hover:bg-[#F1F7F5] rounded-[8px] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / PVC Card Studio Backdrop */}
        <div className="p-6 sm:p-7 bg-[#F3F8F6] flex flex-col items-center">
          
          {/* Printable PVC Card */}
          <div 
            id="obgg-pvc-card"
            className="id-card-print-target w-full max-w-[600px] bg-white border border-[#CBEFE3] rounded-2xl shadow-[0_10px_28px_rgba(9,92,71,0.08)] overflow-hidden relative"
          >
            {/* Signature Brand Teal Top Accent Bar */}
            <div className="h-1.5 w-full bg-brand-gradient" />

            {/* Card Header with Website Logo */}
            <div className="bg-gradient-to-r from-[#ECFAF5] via-[#F4FCF9] to-[#E6F7F1] px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4 border-b border-[#CBEFE3]">
              <div className="flex items-center gap-3.5">
                <OneBoholLogo className="w-[136px] sm:w-[150px] shrink-0" />
                <div className="h-8 w-px bg-[#CBEFE3] hidden sm:block" />
                <div className="hidden sm:block">
                  <h4 className="font-display font-bold text-[11px] tracking-[0.06em] text-[#095C47] uppercase leading-tight">
                    Official Member Credential
                  </h4>
                  <p className="text-[10.5px] text-[#3E5863] font-medium mt-0.5">
                    Party-List &amp; Volunteer Identification Card
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right shrink-0">
                <StatusBadge status={member.status} className="bg-white/90 shadow-flat" />
              </div>
            </div>

            {/* Card Content Grid */}
            <div className="p-5 sm:p-6 grid grid-cols-12 gap-5 sm:gap-6 bg-white">
              
              {/* Left Column: Photo, Registry ID & QR Code inside soft mint panel */}
              <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-between bg-[#F7FBFA] border border-[#E2F2EC] rounded-xl p-3.5">
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-28 h-28 bg-white border-2 border-[#BCE8DA] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(9,92,71,0.08)]">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#ECFAF5] text-[#095C47] font-bold text-xl">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 text-center w-full">
                    <div className="text-[9px] font-bold text-[#5C7480] uppercase tracking-[0.08em]">
                      Member Registry ID
                    </div>
                    <div className="font-mono font-bold text-[#095C47] text-xs bg-[#E3F8F0] border border-[#BCE8DA] px-2.5 py-1 rounded-[6px] mt-1">
                      {member.id}
                    </div>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="mt-3.5 flex flex-col items-center">
                  <SvgQrCode code={member.id} />
                  <span className="text-[8.5px] font-mono text-[#5C7480] text-center leading-tight mt-1.5">
                    Verifiable Digital Token
                  </span>
                </div>
              </div>

              {/* Right Column: Member Details */}
              <div className="col-span-12 sm:col-span-8 flex flex-col justify-between text-left">
                <div>
                  {/* Full Name */}
                  <div className="border-b border-[#E8F0EE] pb-3 mb-3.5">
                    <div className="text-[9.5px] font-bold text-[#5C7480] uppercase tracking-[0.08em]">
                      Full Legal Name
                    </div>
                    <div className="font-display text-lg sm:text-[19px] font-bold text-[#0B2027] uppercase leading-snug tracking-tight mt-0.5">
                      {member.lastName}, {member.firstName} {member.middleName} {member.suffix || ''}
                    </div>
                    <div className="text-xs text-[#33474F] font-medium mt-1">
                      {member.sex} • {member.age} yrs old • {member.civilStatus}
                    </div>
                  </div>

                  {/* Role & Sector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                    <div className="bg-[#F7FBFA] border border-[#E2F2EC] rounded-xl p-2.5">
                      <span className="text-[9px] font-bold text-[#5C7480] uppercase tracking-[0.06em] block">
                        Organizational Designation
                      </span>
                      <span className="inline-flex items-center text-white text-[11px] font-bold px-2.5 py-1 rounded-[6px] tracking-wide shadow-[0_2px_6px_rgba(10,98,115,0.16)] mt-1.5 bg-brand-gradient">
                        {member.role}
                      </span>
                    </div>

                    <div className="bg-[#F7FBFA] border border-[#E2F2EC] rounded-xl p-2.5">
                      <span className="text-[9px] font-bold text-[#5C7480] uppercase tracking-[0.06em] block">
                        Sectoral / Alliance Chapter
                      </span>
                      <span className="inline-flex items-center bg-[#CCF4E8] text-[#095C47] border border-[#B5EBD9] text-[11px] font-bold px-2.5 py-1 rounded-[6px] mt-1.5">
                        {member.sector}
                      </span>
                    </div>
                  </div>

                  {/* Jurisdiction & Registration Date */}
                  <div className="bg-[#F7FBFA] border border-[#E2F2EC] p-3 rounded-xl text-[11px] space-y-2">
                    <div className="flex items-start">
                      <MapPin className="w-3.5 h-3.5 text-[#0D946B] shrink-0 mt-0.5 mr-1.5" />
                      <div>
                        <strong className="text-[#0B2027] font-semibold">Jurisdiction: </strong>
                        <span className="text-[#33474F]">
                          Brgy. {member.barangay}, {member.municipality}, {member.province}
                          {member.boholDistrict && ` (${member.boholDistrict})`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E2F2EC]">
                      <div>
                        <span className="text-[#5C7480] font-semibold">Region: </span>
                        <span className="font-medium text-[#33474F]">{member.region}</span>
                      </div>
                      <div>
                        <span className="text-[#5C7480] font-semibold">Reg. Date: </span>
                        <span className="font-mono font-medium text-[#33474F]">{member.dateRegistered}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer security watermark line */}
                <div className="pt-3 mt-3 border-t border-[#E8F0EE] flex justify-between items-center text-[9.5px] text-[#5C7480] font-medium">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#0D946B]" />
                    <span>Authorized by OBGG Executive Council</span>
                  </span>
                  <span className="font-mono font-semibold text-[#095C47]">VALID FOR 2025–2028 TERM</span>
                </div>
              </div>

            </div>

            {/* Bottom Accent Bar */}
            <div className="bg-[#064E3B] px-4 py-2 text-center text-[9px] text-[#CCF4E8] font-mono tracking-[0.1em] uppercase border-t border-[#095C47]">
              CONFIDENTIAL • OFFICIAL PROPERTY OF ONE BOHOL FOR GOOD GOVERNANCE
            </div>
          </div>
        </div>

        {/* Modal Window Footer Actions */}
        <div className="no-print bg-white px-6 sm:px-7 py-4 border-t border-[#E5EFEA] flex flex-wrap items-center justify-between gap-3">
          <div>
            {isPending && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={async () => {
                  await verifyMember(member.id);
                }}
                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Verify Member Now
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5 text-primary" />}
            >
              Print PVC ID Card
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={closeIdModal}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
