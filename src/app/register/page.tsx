'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMembers } from '@/context/MemberContext';
import { useAlert } from '@/context/AlertContext';
import { 
  getRegions, 
  getProvinces, 
  getMunicipalities, 
  getBarangays,
  getBoholDistrict 
} from '@/lib/philippines-geo';
import { calculateAge } from '@/lib/seed';
import { OrganizationalRole, SectoralGroup } from '@/types/member';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  UserCheck
} from 'lucide-react';
import { Button, Input, Select, Card, Badge } from '@/components/ui';

const ROLES: OrganizationalRole[] = [
  'General Member / Volunteer',
  'Barangay Leader',
  'Municipal / City Coordinator',
  'Provincial Coordinator',
  'Regional Coordinator',
  'National / Executive Officer',
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

export default function RegisterMemberPage() {
  const router = useRouter();
  const { addMember, openIdModal } = useMembers();
  const { showAlert } = useAlert();

  // Wizard Step (1, 2, 3, 4)
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [birthdate, setBirthdate] = useState('1992-05-18');
  const [sex, setSex] = useState<'Male' | 'Female'>('Male');
  const [civilStatus, setCivilStatus] = useState<'Single' | 'Married' | 'Widowed' | 'Separated'>('Married');

  const [mobile, setMobile] = useState('0917-555-0199');
  const [email, setEmail] = useState('');

  // Default to Bohol (Region VII)
  const [region, setRegion] = useState('Region VII (Central Visayas)');
  const [province, setProvince] = useState('Bohol');
  const [municipality, setMunicipality] = useState('Tagbilaran City');
  const [barangay, setBarangay] = useState('Poblacion II');

  const [role, setRole] = useState<OrganizationalRole>('General Member / Volunteer');
  const [sector, setSector] = useState<SectoralGroup>('REKOM Alliance Chapter');
  const [confirmedAccuracy, setConfirmedAccuracy] = useState<boolean>(false);

  // Photo Upload & Compression State
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://randomuser.me/api/portraits/men/44.jpg'
  );
  const [photoBlob, setPhotoBlob] = useState<Blob | undefined>(undefined);
  const [photoStats, setPhotoStats] = useState<string>('Standard 1:1 format (300x300 optimized)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed Age
  const computedAge = useMemo(() => {
    return calculateAge(birthdate);
  }, [birthdate]);

  // Dynamic Geographic cascades
  const regionOptions = useMemo(() => getRegions(), []);
  const provinceOptions = useMemo(() => getProvinces(region), [region]);
  const municipalityOptions = useMemo(() => getMunicipalities(province), [province]);
  const barangayOptions = useMemo(() => getBarangays(municipality), [municipality]);

  const handleRegionChange = (newReg: string) => {
    setRegion(newReg);
    const provs = getProvinces(newReg);
    const firstProv = provs[0] || '';
    setProvince(firstProv);
    const munis = getMunicipalities(firstProv);
    const firstMuni = munis[0] || '';
    setMunicipality(firstMuni);
    const brgys = getBarangays(firstMuni);
    setBarangay(brgys[0] || 'Poblacion');
  };

  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    const munis = getMunicipalities(newProv);
    const firstMuni = munis[0] || '';
    setMunicipality(firstMuni);
    const brgys = getBarangays(firstMuni);
    setBarangay(brgys[0] || 'Poblacion');
  };

  const handleMunicipalityChange = (newMuni: string) => {
    setMunicipality(newMuni);
    const brgys = getBarangays(newMuni);
    setBarangay(brgys[0] || 'Poblacion');
  };

  // Client-side 1:1 image square crop & compression with permanent Data URL fallback
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showAlert('Please select a valid image file (JPEG, PNG, WebP).', {
        title: 'Invalid File Format',
        type: 'warning',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 300, 300);

        // Persistent Data URL for immediate offline/local storage resilience
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoUrl(dataUrl);

        // Binary blob for Supabase storage uploading
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setPhotoBlob(blob);
              setPhotoStats(
                `Cropped 300x300 • Compressed: ${Math.round(blob.size / 1024)} KB`
              );
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = () => {
        showAlert('Could not decode the selected image. Please try another image file.', {
          title: 'Image Error',
          type: 'error',
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);

    // Reset input value so selecting the same file again triggers onChange cleanly
    e.target.value = '';
  };

  // Quick Preset Sample Portrait
  const handleUseSamplePortrait = () => {
    const portraitId = Math.floor(Math.random() * 85) + 1;
    const genderSlug = sex === 'Male' ? 'men' : 'women';
    const sample = `https://randomuser.me/api/portraits/${genderSlug}/${portraitId}.jpg`;
    setPhotoUrl(sample);
    setPhotoBlob(undefined);
    setPhotoStats('Loaded formal GovTech demo portrait (300x300)');
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!firstName.trim() || !lastName.trim() || !birthdate) {
        showAlert('Please provide First Name, Last Name, and Birthdate to continue.', {
          title: 'Missing Legal Details',
          type: 'warning',
        });
        return false;
      }
      if (computedAge < 18) {
        showAlert('Registered member must be at least 18 years old under organizational policy.', {
          title: 'Age Requirement',
          type: 'warning',
        });
        return false;
      }
    } else if (currentStep === 2) {
      if (!mobile.trim()) {
        showAlert('Please provide an official mobile contact number for SMS notices.', {
          title: 'Contact Required',
          type: 'warning',
        });
        return false;
      }
    } else if (currentStep === 3) {
      if (!region || !province || !municipality || !barangay) {
        showAlert('Please select complete Jurisdiction details (Region, Province, City/Municipality, Barangay).', {
          title: 'Incomplete Jurisdiction',
          type: 'warning',
        });
        return false;
      }
    } else if (currentStep === 4) {
      if (!role) {
        showAlert('Please select an Organizational Designation / Role.', {
          title: 'Designation Required',
          type: 'warning',
        });
        return false;
      }
      if (!sector) {
        showAlert('Please select a Sectoral / Alliance Chapter.', {
          title: 'Chapter Required',
          type: 'warning',
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Explicit step advancement on Enter key for steps 1-3
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (step < 4) {
        e.preventDefault();
        handleNext();
      }
    }
  };

  // Final Submission (strictly enabled only on Step 4 after confirmation)
  const handleSubmit = async () => {
    // Hard guard: Never allow submission unless on step 4
    if (step !== 4) return;

    if (!confirmedAccuracy) {
      showAlert('Please check the confirmation box to certify the member details before submitting.', {
        title: 'Certification Required',
        type: 'warning',
      });
      return;
    }

    // Validate all 4 steps for complete data integrity
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    if (!validateStep(4)) {
      setStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      const boholDistrict = province === 'Bohol' ? getBoholDistrict(municipality) : undefined;
      const today = new Date().toISOString().slice(0, 10);
      const generatedEmail =
        email.trim() ||
        `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName
          .toLowerCase()
          .replace(/\s+/g, '')}@onebohol.org`;

      const newMember = await addMember(
        {
          firstName: firstName.trim(),
          middleName: middleName.trim(),
          lastName: lastName.trim(),
          suffix: suffix.trim(),
          birthdate,
          age: computedAge,
          sex,
          civilStatus,
          mobile: mobile.trim(),
          email: generatedEmail,
          region,
          province,
          municipality,
          barangay,
          boholDistrict,
          role,
          sector,
          photoUrl,
          dateRegistered: today,
          status: 'PENDING',
        },
        photoBlob
      );

      openIdModal(newMember);
      router.push('/members');
    } catch (err) {
      console.error('Registration failed:', err);
      showAlert('An error occurred while saving the member registration. Please try again.', {
        title: 'Registration Error',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Page Title & Meta Header */}
      <div className="pb-4 border-b border-line">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Member Registration Wizard
        </h1>
        <p className="text-xs text-ink-soft mt-0.5">
          Follow the four-step protocol to register an official member and generate a verifiable PVC Digital ID.
        </p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { num: 1, label: 'Personal Info' },
          { num: 2, label: 'Contact Details' },
          { num: 3, label: 'Jurisdiction' },
          { num: 4, label: 'Role & Photo' },
        ].map((item) => {
          const isActive = step === item.num;
          const isDone = step > item.num;
          return (
            <div
              key={item.num}
              className={`p-3 rounded-sm border transition-all flex items-center space-x-2.5 ${
                isActive
                  ? 'bg-primary/10 border-primary text-primary-deep font-bold shadow-flat'
                  : isDone
                  ? 'bg-surface border-line text-ink-soft font-semibold'
                  : 'bg-background border-line text-muted'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-xs flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive
                    ? 'bg-primary text-white'
                    : isDone
                    ? 'bg-success text-white'
                    : 'bg-surface-sunk text-muted'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : item.num}
              </div>
              <span className="text-xs truncate">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Wizard Form Container */}
      <Card elevation="raised" radius="lg" className="overflow-hidden">
        
        {/* Step Header Bar */}
        <div className="px-6 py-4 border-b border-line bg-surface/50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-ink uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>
              {step === 1 && 'Step 1: Legal Identity & Personal Details'}
              {step === 2 && 'Step 2: Official Contact Information'}
              {step === 3 && 'Step 3: Electoral Jurisdiction'}
              {step === 4 && 'Step 4: Organizational Role & 1:1 ID Portrait'}
            </span>
          </div>
          <Badge variant="primary">
            Step {step} of 4
          </Badge>
        </div>

        <div onKeyDown={handleKeyDown}>
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <Input
                      label="First Name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Gabriel"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      label="Middle Name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="e.g. Borja"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <Input
                      label="Last Name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Chatto"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <Input
                      label="Suffix"
                      value={suffix}
                      onChange={(e) => setSuffix(e.target.value)}
                      placeholder="Jr."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Input
                    label="Birthdate"
                    type="date"
                    required
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    hint={`Computed Age: ${computedAge} years old`}
                  />

                  <Select
                    label="Sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value as 'Male' | 'Female')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>

                  <Select
                    label="Civil Status"
                    value={civilStatus}
                    onChange={(e) =>
                      setCivilStatus(
                        e.target.value as 'Single' | 'Married' | 'Widowed' | 'Separated'
                      )
                    }
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </Select>
                </div>
              </div>
            )}

            {/* STEP 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Official Mobile Number"
                    required
                    placeholder="09XX-XXX-XXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    hint="Required for official SMS bulletins and emergency alliance alerts."
                  />

                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="e.g. member@onebohol.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    hint="Will auto-generate an official organizational alias if left blank."
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Jurisdiction */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-sm text-xs text-primary-deep flex items-center space-x-2.5">
                  <Info className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Defaulted to <strong>Bohol (Region VII)</strong>. You may select any of the 17 Philippine regions for national alliance delegates.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Region"
                    value={region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                  >
                    {regionOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Province"
                    value={province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                  >
                    {provinceOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="City / Municipality"
                    value={municipality}
                    onChange={(e) => handleMunicipalityChange(e.target.value)}
                  >
                    {municipalityOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Barangay"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                  >
                    {barangayOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            {/* STEP 4: Role & Photo */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Organizational Designation / Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as OrganizationalRole)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Sectoral / Alliance Chapter"
                    value={sector}
                    onChange={(e) => setSector(e.target.value as SectoralGroup)}
                  >
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* 1:1 ID Photo Upload Section */}
                <div className="border border-line p-5 rounded-md bg-surface space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-ink flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-primary" />
                        1:1 Square Member ID Portrait
                      </h4>
                      <p className="text-xs text-muted">
                        Square center-cropped portrait with automated compression
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleUseSamplePortrait}
                      leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
                    >
                      Use Sample Portrait
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                    {/* Photo Preview Box (Strictly 1:1) */}
                    <div className="relative w-28 h-28 bg-background border-2 border-line rounded-md overflow-hidden shrink-0 shadow-flat">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          <UserCheck className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        leftIcon={<Upload className="w-3.5 h-3.5 text-muted" />}
                      >
                        Upload Local Photo File
                      </Button>
                      <div>
                        <Badge variant="primary" className="font-mono text-[10px]">
                          {photoStats}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Final Certification Checkbox */}
                <div className="p-4 rounded-md bg-primary/5 border border-primary/20 flex items-start space-x-3">
                  <input
                    id="confirm-registration"
                    type="checkbox"
                    checked={confirmedAccuracy}
                    onChange={(e) => setConfirmedAccuracy(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-xs border-primary/40 text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <label
                    htmlFor="confirm-registration"
                    className="text-xs text-ink-soft leading-relaxed cursor-pointer select-none"
                  >
                    <span className="font-semibold text-ink">I certify and confirm that the personal details, electoral jurisdiction, role, and portrait are verified</span> for official registration under One Bohol For Good Governance.
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Wizard Navigation Footer */}
          <div className="bg-surface/50 px-6 py-4 border-t border-line flex items-center justify-between">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              )}
            </div>

            <div>
              {step < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  disabled={!confirmedAccuracy || isSubmitting}
                  isLoading={isSubmitting}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Registering...' : 'Complete Registration & Issue ID'}
                </Button>
              )}
            </div>
          </div>
        </div>

      </Card>

    </div>
  );
}
