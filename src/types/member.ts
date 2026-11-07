export type MemberStatus = 'VERIFIED' | 'PENDING' | 'INACTIVE';

export type OrganizationalRole =
  | 'National / Executive Officer'
  | 'Regional Coordinator'
  | 'Provincial Coordinator'
  | 'Municipal / City Coordinator'
  | 'Barangay Leader'
  | 'General Member / Volunteer';

export type SectoralGroup =
  | 'REKOM Alliance Chapter'
  | 'Youth & Students Sector'
  | "Women's Sector"
  | 'Farmers & Fisherfolk Sector'
  | 'Transport & Labor Sector'
  | 'Business & Private Sector'
  | 'Senior Citizens & PWD'
  | 'Overseas / OFW Chapter';

export interface Member {
  id: string; // e.g. "OBGG-2026-0001"
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthdate: string; // YYYY-MM-DD
  age: number;
  sex: 'Male' | 'Female';
  civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated';
  mobile: string; // 09XX-XXX-XXXX
  email: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  boholDistrict?: 'District 1' | 'District 2' | 'District 3';
  role: OrganizationalRole;
  sector: SectoralGroup;
  photoUrl: string;
  dateRegistered: string; // YYYY-MM-DD
  status: MemberStatus;
}
