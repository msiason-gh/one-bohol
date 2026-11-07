import { Member, MemberStatus, OrganizationalRole, SectoralGroup } from '@/types/member';
import { PHILIPPINES_REGIONS } from './philippines-geo';

const MALE_FIRST_NAMES = [
  'Juan', 'Jose', 'Rodrigo', 'Manuel', 'Danilo', 'Ramon', 'Eduardo', 'Vicente', 'Antonio', 'Francisco',
  'Carlos', 'Fernando', 'Renato', 'Gabriel', 'Ernesto', 'Dominador', 'Melchor', 'Salvador', 'Arnel', 'Crisanto',
  'Leopoldo', 'Dante', 'Noel', 'Jaime', 'Rolando', 'Efren', 'Benjamin', 'Arturo', 'Gregorio', 'Diosdado',
  'Mark Angelo', 'John Paul', 'Christian', 'Paolo', 'Lorenzo', 'Jerome', 'Rafael', 'Alvin', 'Nestor', 'Ruben',
  'Ferdinand', 'Guillermo', 'Reynaldo', 'Teodoro', 'Emilio', 'Armando', 'Severino', 'Federico', 'Bonifacio', 'Marciano',
  'Bernardo', 'Cesar', 'Isidro', 'Rogelio', 'Mariano', 'Lauro', 'Simeon', 'Apolonio', 'Catalino', 'Basilio',
];

const FEMALE_FIRST_NAMES = [
  'Maria', 'Elena', 'Corazon', 'Carmelita', 'Leticia', 'Rosario', 'Teresa', 'Milagros', 'Imelda', 'Lourdes',
  'Esperanza', 'Concepcion', 'Gloria', 'Aurora', 'Remedios', 'Josefina', 'Florencia', 'Amparo', 'Socorro', 'Divina',
  'Maricel', 'Rowena', 'Cherry', 'Grace', 'Kristine', 'Princess', 'Angelica', 'Bea', 'Fatima', 'Jocelyn',
  'Cynthia', 'Lorna', 'Evelyn', 'Aileen', 'Melanie', 'Arlene', 'Gemma', 'Marilou', 'Rosalinda', 'Adoracion',
  'Consolacion', 'Felicidad', 'Victoria', 'Leonora', 'Catalina', 'Purificacion', 'Herminia', 'Clara', 'Jacinta', 'Salome',
  'Nenita', 'Priscila', 'Julita', 'Belen', 'Pacita', 'Criselda', 'Luzviminda', 'Estrella', 'Perlita', 'Zenaida',
];

const MIDDLE_NAMES = [
  'Tan', 'Lim', 'Santos', 'Reyes', 'Cruz', 'Bautista', 'Del Rosario', 'Villanueva', 'Fernandez', 'Garcia',
  'Mendoza', 'Aquino', 'Castillo', 'Torres', 'Pascual', 'Flores', 'Tolentino', 'Salazar', 'Navarro', 'Mercado',
  'Soriano', 'Valencia', 'Ocampo', 'Cortes', 'Suarez', 'Alcantara', 'Estrada', 'Aguilar', 'Rosales', 'Manalo',
  'Borja', 'Chatto', 'Aumentado', 'Relampagos', 'Japson', 'Gallares', 'Zarraga', 'Maslog', 'Lapez', 'Herrera',
];

const SURNAMES = [
  // Boholano & Central Visayas prominent family names
  'Chatto', 'Aumentado', 'Relampagos', 'Japson', 'Cajes', 'Torres', 'Maslog', 'Gallares', 'Zarraga', 'Borja',
  'Tutor', 'Abapo', 'Lapez', 'Besas', 'Paredes', 'Herrera', 'Cabulao', 'Dano', 'Lagunay', 'Paler',
  'Bomediano', 'Caminade', 'Balistoy', 'Gementiza', 'Bontuyan', 'Loquellano', 'Villacastin', 'Aparicio', 'Cabagnot', 'Piquero',
  'Salo', 'Uy', 'Cloma', 'Lumantas', 'Magallanes', 'Pabillaran', 'Mumar', 'Boyles', 'Socorin', 'Cimagala',
  // Classic Filipino national surnames
  'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Flores', 'Castillo',
  'Villanueva', 'Ramos', 'Castro', 'Rivera', 'Aquino', 'Fernandez', 'Lopez', 'Santiago', 'Morales', 'Perez',
  'Mercado', 'Dela Cruz', 'Del Rosario', 'Valdez', 'Gutierrez', 'Espiritu', 'Pascual', 'Dizon', 'Soriano', 'Tolentino',
  'De Leon', 'Navarro', 'Salazar', 'Domingo', 'Padilla', 'Vergara', 'Estrada', 'Rosales', 'Guerrero', 'Manalo',
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

// Helper to calculate exact age from birthdate
export function calculateAge(birthdateStr: string): number {
  if (!birthdateStr) return 0;
  const birth = new Date(birthdateStr);
  if (isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Pseudo-random deterministic generator using linear congruential formula
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSeedMembers(): Member[] {
  const rand = seededRandom(20260509);
  const members: Member[] = [];
  const usedNames = new Set<string>();

  const boholRegion = PHILIPPINES_REGIONS.find((r) => r.code === 'REGION-VII')!;
  const boholProvince = boholRegion.provinces.find((p) => p.name === 'Bohol')!;
  const boholMunis = boholProvince.municipalities;

  const otherRegions = PHILIPPINES_REGIONS.filter((r) => r.code !== 'REGION-VII');

  // Exact 200 members:
  // - 130 Bohol members (~65%) ensuring heavy representation across all 3 districts & Tagbilaran
  // - 70 across the remaining 16 Philippine regions (~35%)
  for (let i = 1; i <= 200; i++) {
    const isBohol = i <= 130;
    const sex: 'Male' | 'Female' = i % 2 === 1 ? 'Male' : 'Female';

    // Unique name resolution
    let firstName = '';
    let middleName = '';
    let lastName = '';
    let fullName = '';
    let attempts = 0;

    do {
      const firstPool = sex === 'Male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
      firstName = firstPool[Math.floor(rand() * firstPool.length)];
      middleName = MIDDLE_NAMES[Math.floor(rand() * MIDDLE_NAMES.length)];
      lastName = SURNAMES[Math.floor(rand() * SURNAMES.length)];
      fullName = `${lastName}, ${firstName} ${middleName}`;
      attempts++;
      if (attempts > 100) {
        firstName = `${firstName} ${String.fromCharCode(65 + (i % 26))}.`;
        fullName = `${lastName}, ${firstName} ${middleName}`;
        break;
      }
    } while (usedNames.has(fullName));
    usedNames.add(fullName);

    // Birthdate (Ages 18 - 72)
    const birthYear = 1954 + Math.floor(rand() * 52);
    const birthMonth = String(1 + Math.floor(rand() * 12)).padStart(2, '0');
    const birthDay = String(1 + Math.floor(rand() * 28)).padStart(2, '0');
    const birthdate = `${birthYear}-${birthMonth}-${birthDay}`;
    const age = calculateAge(birthdate);

    // Civil status
    const civilStatuses: Array<'Single' | 'Married' | 'Widowed' | 'Separated'> = ['Single', 'Married', 'Married', 'Married', 'Widowed', 'Separated'];
    const civilStatus = age < 24 ? 'Single' : civilStatuses[Math.floor(rand() * civilStatuses.length)];

    // Mobile & Email
    const mobilePrefix = ['0917', '0918', '0927', '0939', '0945', '0977', '0995'][Math.floor(rand() * 7)];
    const mobileNum = String(1000000 + Math.floor(rand() * 8999999)).slice(0, 7);
    const mobile = `${mobilePrefix}-${mobileNum.slice(0, 3)}-${mobileNum.slice(3)}`;
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
    const email = `${cleanFirst}.${cleanLast}${i}@onebohol.org`;

    // Geography
    let region = '';
    let province = '';
    let municipality = '';
    let barangay = '';
    let boholDistrict: 'District 1' | 'District 2' | 'District 3' | undefined = undefined;

    if (isBohol) {
      region = 'Region VII (Central Visayas)';
      province = 'Bohol';
      // Cycle through Bohol's 48 LGUs evenly first, then distribute remaining
      const muniObj = boholMunis[(i - 1) % boholMunis.length];
      municipality = muniObj.name;
      boholDistrict = muniObj.district;
      barangay = muniObj.barangays[Math.floor(rand() * muniObj.barangays.length)];
    } else {
      const regObj = otherRegions[(i - 131) % otherRegions.length];
      region = regObj.name;
      const provObj = regObj.provinces[Math.floor(rand() * regObj.provinces.length)];
      province = provObj.name;
      const muniObj = provObj.municipalities[Math.floor(rand() * provObj.municipalities.length)];
      municipality = muniObj.name;
      barangay = muniObj.barangays[Math.floor(rand() * muniObj.barangays.length)];
    }

    // Role Distribution (Realistic hierarchy: Few National, more Provincial/Municipal, majority Barangay & Volunteers)
    let role: OrganizationalRole;
    if (i <= 6) {
      role = 'National / Executive Officer';
    } else if (i <= 18) {
      role = 'Regional Coordinator';
    } else if (i <= 42) {
      role = 'Provincial Coordinator';
    } else if (i <= 80) {
      role = 'Municipal / City Coordinator';
    } else if (i <= 140) {
      role = 'Barangay Leader';
    } else {
      role = 'General Member / Volunteer';
    }

    // Sectoral Group
    const sector = SECTORS[Math.floor(rand() * SECTORS.length)];

    // Status (High verification rate for GovTech registry: ~78% Verified, ~18% Pending, ~4% Inactive)
    let status: MemberStatus = 'VERIFIED';
    const statusRoll = rand();
    if (statusRoll < 0.18) {
      status = 'PENDING';
    } else if (statusRoll < 0.22) {
      status = 'INACTIVE';
    }

    // Gender-matched portrait photo URL
    const portraitIndex = ((i * 7) % 95) + 1;
    const genderSlug = sex === 'Male' ? 'men' : 'women';
    const photoUrl = `https://randomuser.me/api/portraits/${genderSlug}/${portraitIndex}.jpg`;

    // Registration date (spanning 2025-01-15 through 2026-10-30)
    const regMonth = String(1 + Math.floor(rand() * 12)).padStart(2, '0');
    const regDay = String(1 + Math.floor(rand() * 28)).padStart(2, '0');
    const regYear = i < 80 ? '2025' : '2026';
    const dateRegistered = `${regYear}-${regMonth}-${regDay}`;

    const memberId = `OBGG-2026-${String(i).padStart(4, '0')}`;

    members.push({
      id: memberId,
      firstName,
      middleName,
      lastName,
      birthdate,
      age,
      sex,
      civilStatus,
      mobile,
      email,
      region,
      province,
      municipality,
      barangay,
      boholDistrict,
      role,
      sector,
      photoUrl,
      dateRegistered,
      status,
    });
  }

  return members;
}

export const SEED_MEMBERS: Member[] = generateSeedMembers();
