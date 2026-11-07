'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMembers } from '@/context/MemberContext';
import { useAlert } from '@/context/AlertContext';
import { 
  getRegions, 
  getProvinces, 
  getMunicipalities 
} from '@/lib/philippines-geo';
import { OrganizationalRole, SectoralGroup } from '@/types/member';
import { 
  Search, 
  RotateCcw, 
  Download, 
  UserPlus, 
  IdCard, 
  Check, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button, Input, Select, Card, Badge, StatusBadge } from '@/components/ui';

const ROLES: OrganizationalRole[] = [
  'National / Executive Officer',
  'Regional Coordinator',
  'Provincial Coordinator',
  'Municipal / City Coordinator',
  'Barangay Leader',
  'General Member / Volunteer',
];

const SECTORS: SectoralGroup[] = [
  'REKOM Alliance Chapter',
  'Youth & Students Sector',
  "Women's Sector",
  'Farmers & Fisherfolk Sector',
  'Transport & Labor Sector',
  'Business & Private Sector',
  'Senior Citizens & PWD',
  'Overseas / OFW Chapter',
];

type SortField = 'id' | 'name' | 'role' | 'jurisdiction' | 'dateRegistered' | 'status';
type SortOrder = 'asc' | 'desc';

function MembersTableContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || '';
  const { members, openIdModal, verifyMember, deleteMember } = useMembers();
  const { showConfirm } = useAlert();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [selectedSex, setSelectedSex] = useState('');

  // Sorting State
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination State
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Cascading Geographic Dropdown lists
  const regionOptions = useMemo(() => getRegions(), []);
  const provinceOptions = useMemo(() => {
    return selectedRegion ? getProvinces(selectedRegion) : [];
  }, [selectedRegion]);
  const municipalityOptions = useMemo(() => {
    return selectedProvince ? getMunicipalities(selectedProvince) : [];
  }, [selectedProvince]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    setSelectedProvince('');
    setSelectedMunicipality('');
    setCurrentPage(1);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
    setSelectedMunicipality('');
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? (
        <ArrowUp className="w-3.5 h-3.5 text-primary-deep shrink-0" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-primary-deep shrink-0" />
      );
    }
    return <ArrowUpDown className="w-3.5 h-3.5 text-muted/35 group-hover:text-muted/80 shrink-0 transition-colors" />;
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedMunicipality('');
    setSelectedRole('');
    setSelectedSector('');
    setSelectedStatus('');
    setSelectedSex('');
    setSortField(null);
    setSortOrder('asc');
    setCurrentPage(1);
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName =
          `${m.firstName} ${m.middleName} ${m.lastName}`.toLowerCase().includes(query) ||
          `${m.lastName}, ${m.firstName} ${m.middleName}`.toLowerCase().includes(query) ||
          `${m.lastName} ${m.firstName}`.toLowerCase().includes(query);
        const matchesId = m.id.toLowerCase().includes(query);
        const matchesBrgy = m.barangay.toLowerCase().includes(query);
        const matchesMuni = m.municipality.toLowerCase().includes(query);

        if (!matchesName && !matchesId && !matchesBrgy && !matchesMuni) {
          return false;
        }
      }

      if (selectedRegion && m.region !== selectedRegion) return false;
      if (selectedProvince && m.province !== selectedProvince) return false;
      if (selectedMunicipality && m.municipality !== selectedMunicipality) return false;
      if (selectedRole && m.role !== selectedRole) return false;
      if (selectedSector && m.sector !== selectedSector) return false;
      if (selectedStatus && m.status !== selectedStatus) return false;
      if (selectedSex && m.sex !== selectedSex) return false;

      return true;
    });
  }, [
    members,
    searchTerm,
    selectedRegion,
    selectedProvince,
    selectedMunicipality,
    selectedRole,
    selectedSector,
    selectedStatus,
    selectedSex,
  ]);

  // Sorted members
  const sortedMembers = useMemo(() => {
    if (!sortField) return filteredMembers;
    return [...filteredMembers].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id, undefined, { numeric: true });
          break;
        case 'name': {
          const nameA = `${a.lastName}, ${a.firstName} ${a.middleName || ''}`.toLowerCase();
          const nameB = `${b.lastName}, ${b.firstName} ${b.middleName || ''}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        }
        case 'role': {
          const roleA = `${a.role} ${a.sector}`.toLowerCase();
          const roleB = `${b.role} ${b.sector}`.toLowerCase();
          comparison = roleA.localeCompare(roleB);
          break;
        }
        case 'jurisdiction': {
          const jurA = `${a.barangay} ${a.municipality} ${a.province}`.toLowerCase();
          const jurB = `${b.barangay} ${b.municipality} ${b.province}`.toLowerCase();
          comparison = jurA.localeCompare(jurB);
          break;
        }
        case 'dateRegistered':
          comparison = a.dateRegistered.localeCompare(b.dateRegistered);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredMembers, sortField, sortOrder]);

  // Pagination slicing
  const totalFiltered = sortedMembers.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const currentMembers = sortedMembers.slice(startIndex, startIndex + pageSize);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Member ID',
      'Last Name',
      'First Name',
      'Middle Name',
      'Sex',
      'Age',
      'Civil Status',
      'Mobile',
      'Email',
      'Region',
      'Province',
      'Municipality',
      'Bohol District',
      'Barangay',
      'Organizational Role',
      'Sectoral Group',
      'Date Registered',
      'Status',
    ];

    const rows = sortedMembers.map((m) => [
      `"${m.id}"`,
      `"${m.lastName.replace(/"/g, '""')}"`,
      `"${m.firstName.replace(/"/g, '""')}"`,
      `"${m.middleName.replace(/"/g, '""')}"`,
      `"${m.sex}"`,
      m.age,
      `"${m.civilStatus}"`,
      `"${m.mobile}"`,
      `"${m.email}"`,
      `"${m.region}"`,
      `"${m.province}"`,
      `"${m.municipality}"`,
      `"${m.boholDistrict || 'N/A'}"`,
      `"${m.barangay}"`,
      `"${m.role}"`,
      `"${m.sector}"`,
      `"${m.dateRegistered}"`,
      `"${m.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `OBGG_Members_Roster_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await showConfirm(
      `Are you sure you want to delete member ${name} (${id}) from the official registry? This record will be permanently removed.`,
      {
        title: 'Delete Member Record',
        type: 'danger',
        confirmText: 'Yes, Delete Record',
        cancelText: 'Keep Member',
      }
    );
    if (confirmed) {
      await deleteMember(id);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Member Directory & Registry
          </h1>
          <p className="text-xs text-ink-soft mt-0.5">
            Search, filter, inspect digital credentials, and manage membership status.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Roster (CSV)
          </Button>

          <Button
            href="/register"
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Register New Member
          </Button>
        </div>
      </div>

      {/* Modern Filter Interface Card */}
      <Card elevation="raised" radius="md" className="p-5 space-y-4">
        
        {/* Top search & quick actions */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-96">
            <Input
              type="text"
              placeholder="Search by Name, Member ID, Brgy, or Municipality..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <Button
              onClick={handleResetFilters}
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Filters
            </Button>
            <Badge variant="neutral" className="font-mono text-xs">
              Found: <strong className="text-ink ml-1">{totalFiltered}</strong> / {members.length}
            </Badge>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-3 border-t border-line">
          
          <Select
            label="Region"
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            <option value="">All Regions</option>
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r.split(' ')[0]} ({r.replace(/.*\(|\).*/g, '')})
              </option>
            ))}
          </Select>

          <Select
            label="Province"
            value={selectedProvince}
            onChange={handleProvinceChange}
            disabled={!selectedRegion}
          >
            <option value="">All Provinces</option>
            {provinceOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>

          <Select
            label="City / LGU"
            value={selectedMunicipality}
            onChange={(e) => {
              setSelectedMunicipality(e.target.value);
              setCurrentPage(1);
            }}
            disabled={!selectedProvince}
          >
            <option value="">All Municipalities</option>
            {municipalityOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>

          <Select
            label="Role"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>

          <Select
            label="Sector / Alliance"
            value={selectedSector}
            onChange={(e) => {
              setSelectedSector(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="PENDING">PENDING</option>
            <option value="INACTIVE">INACTIVE</option>
          </Select>

          <Select
            label="Sex"
            value={selectedSex}
            onChange={(e) => {
              setSelectedSex(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>

        </div>
      </Card>

      {/* DataTable Container Card */}
      <Card elevation="raised" radius="md" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface text-ink-soft border-b border-line text-[11px] font-bold uppercase tracking-wider">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer select-none hover:bg-[#EBF7F4] hover:text-[#095C47] transition-colors group"
                  title="Click to sort by Member ID"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Member ID</span>
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer select-none hover:bg-[#EBF7F4] hover:text-[#095C47] transition-colors group"
                  title="Click to sort by Full Name"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>ID Photo & Full Name</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="py-3 px-4 cursor-pointer select-none hover:bg-[#EBF7F4] hover:text-[#095C47] transition-colors group"
                  title="Click to sort by Role & Sector"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Role & Sector</span>
                    {renderSortIcon('role')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('jurisdiction')}
                  className="py-3 px-4 cursor-pointer select-none hover:bg-[#EBF7F4] hover:text-[#095C47] transition-colors group"
                  title="Click to sort by Jurisdiction"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Jurisdiction</span>
                    {renderSortIcon('jurisdiction')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dateRegistered')}
                  className="py-3 px-4 cursor-pointer select-none hover:bg-[#EBF7F4] hover:text-[#095C47] transition-colors group"
                  title="Click to sort by Registration Date"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Date Reg.</span>
                    {renderSortIcon('dateRegistered')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer select-none hover:bg-[#EBF7F4] hover:text-[#095C47] transition-colors group"
                  title="Click to sort by Status"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {currentMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-muted">
                    <div className="max-w-sm mx-auto space-y-3">
                      <p className="font-bold text-sm text-ink">
                        No members match the selected filters.
                      </p>
                      <p className="text-xs">
                        Try modifying your search criteria or resetting filters to view all records.
                      </p>
                      <Button
                        onClick={handleResetFilters}
                        variant="secondary"
                        size="sm"
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentMembers.map((m, index) => {
                  const isAltRow = index % 2 === 1;
                  return (
                    <tr
                      key={m.id}
                      className={`gov-table-row-hover transition-colors ${
                        isAltRow ? 'bg-surface/40' : 'bg-background'
                      }`}
                    >
                      {/* Member ID */}
                      <td className="py-3 px-4 font-mono font-bold text-primary-deep whitespace-nowrap">
                        {m.id}
                      </td>

                      {/* Photo & Full Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-9 h-9 rounded-full border border-line overflow-hidden shrink-0 bg-surface-sunk shadow-flat">
                            {m.photoUrl ? (
                              <Image
                                src={m.photoUrl}
                                alt={m.lastName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-primary-deep bg-primary/10">
                                {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-ink tracking-tight">
                              {m.lastName}, {m.firstName} {m.middleName ? `${m.middleName.charAt(0)}.` : ''} {m.suffix || ''}
                            </div>
                            <div className="text-[11px] text-muted font-medium">
                              {m.sex} • {m.age} yrs • {m.civilStatus}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Sector */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-ink">{m.role}</div>
                        <div className="text-[10px] text-primary-deep bg-primary/10 inline-block px-1.5 py-0.5 rounded-xs border border-primary/20 mt-0.5 font-medium">
                          {m.sector}
                        </div>
                      </td>

                      {/* Jurisdiction */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-ink">
                          Brgy. {m.barangay}, {m.municipality}
                        </div>
                        <div className="text-[11px] text-muted">
                          {m.province} {m.boholDistrict && `(${m.boholDistrict})`}
                        </div>
                      </td>

                      {/* Date Reg */}
                      <td className="py-3 px-4 font-mono text-muted whitespace-nowrap text-[11px]">
                        {m.dateRegistered}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={m.status} />
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openIdModal(m)}
                          leftIcon={<IdCard className="w-3.5 h-3.5 text-primary" />}
                        >
                          ID Card
                        </Button>

                        {m.status === 'PENDING' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => verifyMember(m.id)}
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                          >
                            Verify
                          </Button>
                        )}

                        <button
                          onClick={() => handleDelete(m.id, `${m.firstName} ${m.lastName}`)}
                          className="p-1.5 text-muted hover:text-error hover:bg-error/10 rounded-xs transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Refined Pagination Footer */}
        <div className="bg-surface/50 border-t border-line px-5 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="flex items-center space-x-3 text-muted">
            <span>
              Showing <strong className="text-ink font-mono">{totalFiltered > 0 ? startIndex + 1 : 0}</strong> to{' '}
              <strong className="text-ink font-mono">{Math.min(startIndex + pageSize, totalFiltered)}</strong> of{' '}
              <strong className="text-ink font-mono">{totalFiltered}</strong> members
            </span>

            <div className="flex items-center space-x-1.5 pl-3 border-l border-line">
              <span className="text-[11px] font-bold text-muted uppercase">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 bg-background border border-line text-xs rounded-xs font-mono font-bold text-ink focus-glow cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage <= 1}
              className="p-1.5 bg-background border border-line rounded-xs disabled:opacity-40 hover:bg-surface text-ink transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="p-1.5 bg-background border border-line rounded-xs disabled:opacity-40 hover:bg-surface text-ink transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono font-bold text-ink bg-background border border-line rounded-xs text-xs">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="p-1.5 bg-background border border-line rounded-xs disabled:opacity-40 hover:bg-surface text-ink transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage >= totalPages}
              className="p-1.5 bg-background border border-line rounded-xs disabled:opacity-40 hover:bg-surface text-ink transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1600px] mx-auto px-4 py-12 text-center text-muted font-mono text-sm">
          Loading Member Directory...
        </div>
      }
    >
      <MembersTableContent />
    </Suspense>
  );
}
