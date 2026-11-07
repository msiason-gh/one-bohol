'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Member, MemberStatus } from '@/types/member';
import {
  fetchAllMembers,
  insertMemberRecord,
  updateMemberStatusRecord,
  deleteMemberRecord,
  reseedMembers,
  uploadMemberPhoto,
} from '@/lib/member-service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SEED_MEMBERS } from '@/lib/seed';

interface MemberContextType {
  members: Member[];
  isLoading: boolean;
  isSyncing: boolean;
  backendMode: 'SUPABASE_LIVE' | 'LOCAL_FALLBACK';
  isAuthenticated: boolean;
  selectedMemberForId: Member | null;
  loginDemoAdmin: () => void;
  logout: () => void;
  openIdModal: (member: Member) => void;
  closeIdModal: () => void;
  addMember: (memberData: Omit<Member, 'id'>, photoBlob?: Blob) => Promise<Member>;
  verifyMember: (id: string) => Promise<void>;
  toggleMemberStatus: (id: string, status: MemberStatus) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  resetToSeedData: () => Promise<void>;
  refreshMembers: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [backendMode, setBackendMode] = useState<'SUPABASE_LIVE' | 'LOCAL_FALLBACK'>('LOCAL_FALLBACK');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const auth = localStorage.getItem('obgg_auth_admin');
        if (auth !== null) return auth === 'true';
      } catch {
        return true;
      }
    }
    return true;
  });
  const [selectedMemberForId, setSelectedMemberForId] = useState<Member | null>(null);

  // Manual refresh callback
  const refreshMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllMembers();
      setMembers(result.members);
      setBackendMode(result.mode);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Asynchronously fetch members
    fetchAllMembers().then((result) => {
      if (isMounted) {
        setMembers(result.members);
        setBackendMode(result.mode);
        setIsLoading(false);
      }
    });

    // Set up Supabase Realtime channel if enabled
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const channel = client
        .channel('obgg-realtime-members')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'members' },
          () => {
            setIsSyncing(true);
            fetchAllMembers().then((res) => {
              if (isMounted) {
                setMembers(res.members);
                setIsSyncing(false);
              }
            });
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        client.removeChannel(channel);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const loginDemoAdmin = () => {
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('obgg_auth_admin', 'true');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('obgg_auth_admin', 'false');
    }
  };

  const openIdModal = (member: Member) => {
    setSelectedMemberForId(member);
  };

  const closeIdModal = () => {
    setSelectedMemberForId(null);
  };

  // Add Member
  const addMember = async (memberData: Omit<Member, 'id'>, photoBlob?: Blob): Promise<Member> => {
    setIsSyncing(true);

    // Compute next sequential ID (OBGG-2026-XXXX)
    let maxNumber = 200;
    members.forEach((m) => {
      const match = m.id.match(/OBGG-2026-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });

    const newId = `OBGG-2026-${String(maxNumber + 1).padStart(4, '0')}`;
    let finalPhotoUrl = memberData.photoUrl;

    if (photoBlob) {
      const uploadedUrl = await uploadMemberPhoto(newId, photoBlob);
      if (uploadedUrl) {
        finalPhotoUrl = uploadedUrl;
      }
    }

    const newMember: Member = {
      ...memberData,
      id: newId,
      photoUrl: finalPhotoUrl,
    };

    // Optimistic UI update
    setMembers((prev) => [newMember, ...prev]);

    // Persist to Supabase / LocalStorage
    await insertMemberRecord(newMember);
    setIsSyncing(false);

    return newMember;
  };

  // One-click Verify
  const verifyMember = async (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'VERIFIED' } : m))
    );
    setSelectedMemberForId((prev) =>
      prev && prev.id === id ? { ...prev, status: 'VERIFIED' } : prev
    );
    await updateMemberStatusRecord(id, 'VERIFIED');
  };

  // Toggle Status
  const toggleMemberStatus = async (id: string, status: MemberStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    setSelectedMemberForId((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );
    await updateMemberStatusRecord(id, status);
  };

  // Delete Member
  const deleteMember = async (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedMemberForId((prev) => (prev && prev.id === id ? null : prev));
    await deleteMemberRecord(id);
  };

  // Reset to original 200 seeds
  const resetToSeedData = async () => {
    setIsSyncing(true);
    const resetList = await reseedMembers();
    setMembers(resetList);
    setIsSyncing(false);
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        isLoading,
        isSyncing,
        backendMode,
        isAuthenticated,
        selectedMemberForId,
        loginDemoAdmin,
        logout,
        openIdModal,
        closeIdModal,
        addMember,
        verifyMember,
        toggleMemberStatus,
        deleteMember,
        resetToSeedData,
        refreshMembers,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMembers(): MemberContextType {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
}
