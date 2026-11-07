import { Member, MemberStatus, OrganizationalRole, SectoralGroup } from '@/types/member';
import { supabase, isSupabaseConfigured } from './supabase';
import { SEED_MEMBERS } from './seed';

const STORAGE_KEY = 'obgg_members_v3';

export interface MemberDatabaseRow {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  birthdate: string;
  age: number | string;
  sex: 'Male' | 'Female';
  civil_status: 'Single' | 'Married' | 'Widowed' | 'Separated';
  mobile: string;
  email: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  bohol_district?: string | null;
  role: string;
  sector: string;
  photo_url: string;
  date_registered: string;
  status: string;
  created_at?: string;
}

export function mapRowToMember(row: MemberDatabaseRow): Member {
  return {
    id: row.id,
    firstName: row.first_name,
    middleName: row.middle_name || '',
    lastName: row.last_name,
    suffix: row.suffix || '',
    birthdate: row.birthdate,
    age: Number(row.age),
    sex: row.sex,
    civilStatus: row.civil_status,
    mobile: row.mobile,
    email: row.email,
    region: row.region,
    province: row.province,
    municipality: row.municipality,
    barangay: row.barangay,
    boholDistrict: (row.bohol_district as 'District 1' | 'District 2' | 'District 3') || undefined,
    role: row.role as OrganizationalRole,
    sector: row.sector as SectoralGroup,
    photoUrl: row.photo_url,
    dateRegistered: row.date_registered,
    status: row.status as MemberStatus,
  };
}

export function mapMemberToRow(member: Member): MemberDatabaseRow {
  return {
    id: member.id,
    first_name: member.firstName,
    middle_name: member.middleName || '',
    last_name: member.lastName,
    suffix: member.suffix || '',
    birthdate: member.birthdate,
    age: member.age,
    sex: member.sex,
    civil_status: member.civilStatus,
    mobile: member.mobile,
    email: member.email,
    region: member.region,
    province: member.province,
    municipality: member.municipality,
    barangay: member.barangay,
    bohol_district: member.boholDistrict || null,
    role: member.role,
    sector: member.sector,
    photo_url: member.photoUrl,
    date_registered: member.dateRegistered,
    status: member.status,
  };
}

// Local Storage helpers
export function getLocalMembers(): Member[] {
  if (typeof window === 'undefined') return SEED_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MEMBERS));
      return SEED_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MEMBERS));
    return SEED_MEMBERS;
  } catch {
    return SEED_MEMBERS;
  }
}

export function saveLocalMembers(members: Member[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Upload photo to Supabase storage if available
export async function uploadMemberPhoto(id: string, fileOrBlob: Blob): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const filePath = `${id}-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('member-photos')
      .upload(filePath, fileOrBlob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload failed, using fallback URL:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('member-photos').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn('Storage upload exception:', err);
    return null;
  }
}

// Load members with automatic auto-seeding if Supabase table is empty
export async function fetchAllMembers(): Promise<{
  members: Member[];
  mode: 'SUPABASE_LIVE' | 'LOCAL_FALLBACK';
}> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        if (data.length === 0) {
          // Empty table: Auto-seed the 200 initial members in batches of 50
          console.info('OBGG: Supabase members table is empty. Auto-seeding 200 members...');
          const rows = SEED_MEMBERS.map(mapMemberToRow);
          const batchSize = 50;
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            await supabase.from('members').upsert(batch, { onConflict: 'id' });
          }
          saveLocalMembers(SEED_MEMBERS);
          return { members: SEED_MEMBERS, mode: 'SUPABASE_LIVE' };
        }

        const mapped = (data as MemberDatabaseRow[]).map(mapRowToMember);
        saveLocalMembers(mapped);
        return { members: mapped, mode: 'SUPABASE_LIVE' };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }

  return { members: getLocalMembers(), mode: 'LOCAL_FALLBACK' };
}

// Insert member
export async function insertMemberRecord(member: Member): Promise<void> {
  // Update local storage first
  const current = getLocalMembers();
  const updated = [member, ...current.filter((m) => m.id !== member.id)];
  saveLocalMembers(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const row = mapMemberToRow(member);
      const { error } = await supabase.from('members').insert(row);
      if (error) {
        console.error('Supabase insert error:', error.message);
      }
    } catch (err) {
      console.error('Supabase insert exception:', err);
    }
  }
}

// Update status
export async function updateMemberStatusRecord(id: string, status: MemberStatus): Promise<void> {
  const current = getLocalMembers();
  const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
  saveLocalMembers(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status })
        .eq('id', id);
      if (error) {
        console.error('Supabase status update error:', error.message);
      }
    } catch (err) {
      console.error('Supabase update exception:', err);
    }
  }
}

// Delete member
export async function deleteMemberRecord(id: string): Promise<void> {
  const current = getLocalMembers();
  const updated = current.filter((m) => m.id !== id);
  saveLocalMembers(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error.message);
      }
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
  }
}

// Reset/Reseed to original 200 members
export async function reseedMembers(): Promise<Member[]> {
  saveLocalMembers(SEED_MEMBERS);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('members').delete().neq('id', 'NONE');
      const rows = SEED_MEMBERS.map(mapMemberToRow);
      const batchSize = 50;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        await supabase.from('members').upsert(batch, { onConflict: 'id' });
      }
    } catch (err) {
      console.error('Supabase reseed error:', err);
    }
  }

  return SEED_MEMBERS;
}
