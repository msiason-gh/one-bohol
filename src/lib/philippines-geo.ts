export interface GeoRegion {
  name: string;
  code: string;
  provinces: {
    name: string;
    municipalities: {
      name: string;
      district?: 'District 1' | 'District 2' | 'District 3';
      barangays: string[];
    }[];
  }[];
}

// Bohol Districts mapping
export const BOHOL_DISTRICT_1 = [
  'Tagbilaran City',
  'Alburquerque',
  'Antequera',
  'Baclayon',
  'Balilihan',
  'Calape',
  'Catigbian',
  'Corella',
  'Cortes',
  'Dauis',
  'Loon',
  'Maribojoc',
  'Panglao',
  'Sikatuna',
  'Tubigon',
];

export const BOHOL_DISTRICT_2 = [
  'Bien Unido',
  'Buenavista',
  'Clarin',
  'Dagohoy',
  'Danao',
  'Getafe',
  'Inabanga',
  'President Carlos P. Garcia',
  'Sagbayan',
  'San Isidro',
  'San Miguel',
  'Talibon',
  'Trinidad',
  'Ubay',
];

export const BOHOL_DISTRICT_3 = [
  'Alicia',
  'Anda',
  'Batuan',
  'Bilar',
  'Candijay',
  'Carmen',
  'Dimiao',
  'Duero',
  'Garcia Hernandez',
  'Guindulman',
  'Jagna',
  'Lila',
  'Loay',
  'Loboc',
  'Mabini',
  'Pilar',
  'Sevilla',
  'Sierra Bullones',
  'Valencia',
];

export function getBoholDistrict(municipality: string): 'District 1' | 'District 2' | 'District 3' | undefined {
  if (BOHOL_DISTRICT_1.includes(municipality)) return 'District 1';
  if (BOHOL_DISTRICT_2.includes(municipality)) return 'District 2';
  if (BOHOL_DISTRICT_3.includes(municipality)) return 'District 3';
  return undefined;
}

// Bohol Municipalities with realistic barangays
const boholMunicipalities = [
  // District 1
  {
    name: 'Tagbilaran City',
    district: 'District 1' as const,
    barangays: ['Bool', 'Booy', 'Cabawan', 'Cogon', 'Dao', 'Dampas', 'Manga', 'Mansasa', 'Poblacion I', 'Poblacion II', 'Poblacion III', 'San Isidro', 'Taloto', 'Tiptip', 'Ubujan'],
  },
  { name: 'Alburquerque', district: 'District 1' as const, barangays: ['Bahi', 'Castillo', 'Dangay', 'East Poblacion', 'Ponong', 'San Agustin', 'Santa Filomena', 'Tagbuane', 'Toril', 'West Poblacion'] },
  { name: 'Antequera', district: 'District 1' as const, barangays: ['Angilan', 'Bantolinao', 'Bicbicou', 'Can-omay', 'Cansibao', 'Danicop', 'Mag-aso', 'Poblacion', 'Quinapon-an', 'Tabuan', 'Viga'] },
  { name: 'Baclayon', district: 'District 1' as const, barangays: ['Cambanac', 'Das-ag', 'Guindacpan', 'Landican', 'Laya', 'Montaña', 'Pamilacan', 'Poblacion', 'San Fernando', 'San Roque', 'Santa Cruz', 'Taguihon'] },
  { name: 'Balilihan', district: 'District 1' as const, barangays: ['Baucan Norte', 'Baucan Sur', 'Boctol', 'Boyog Norte', 'Boyog Sur', 'Cabad', 'Candasag', 'Del Carmen Weste', 'Del Rosario', 'Hanopol Este', 'Poblacion'] },
  { name: 'Calape', district: 'District 1' as const, barangays: ['Abucayan Norte', 'Binogawan', 'Bonbon', 'Cabudburan', 'Calunasan', 'Camayaan', 'Lucob', 'Mandaug', 'Poblacion', 'San Isidro', 'Santa Cruz', 'Ulputjan'] },
  { name: 'Catigbian', district: 'District 1' as const, barangays: ['Alegria', 'Ambuan', 'Baang', 'Bagtic', 'Bongbong', 'Camboac', 'Candumayao', 'Hagbuaya', 'Poblacion', 'Rizal', 'Triple Union'] },
  { name: 'Corella', district: 'District 1' as const, barangays: ['Anislag', 'Can-aga', 'Can-angca', 'Canapnapan', 'Cancatac', 'Pandol', 'Poblacion', 'San Vicente', 'Tanday'] },
  { name: 'Cortes', district: 'District 1' as const, barangays: ['De la Paz', 'Fatima', 'Loreto', 'Lourdes', 'Malayo Norte', 'Malayo Sur', 'Monserrat', 'Poblacion', 'Rosario', 'Salvador', 'San Roque', 'Upper De la Paz'] },
  { name: 'Dauis', district: 'District 1' as const, barangays: ['Biking', 'Bingag', 'Catarman', 'Dao', 'Mariveles', 'Mayacabac', 'Poblacion', 'San Isidro', 'Songculan', 'Tabalong', 'Tinago'] },
  { name: 'Loon', district: 'District 1' as const, barangays: ['Agahay', 'Badbad Occidental', 'Basak', 'Cabilao Island', 'Cantaluan', 'Cogon Norte', 'Mooc', 'Moto Sur', 'Napo', 'Poblacion', 'Sandingan', 'Tangnan', 'Tubuan'] },
  { name: 'Maribojoc', district: 'District 1' as const, barangays: ['Agahay', 'Aliguay', 'Anislag', 'Bayacabac', 'Cabawan', 'Candavid', 'Dipatlong', 'Lincod', 'Pagnitoan', 'Poblacion', 'San Roque', 'Toril'] },
  { name: 'Panglao', district: 'District 1' as const, barangays: ['Bil-isan', 'Bolod', 'Danao', 'Doljo', 'Libaong', 'Looc', 'Poblacion', 'Tawala', 'Tangnan'] },
  { name: 'Sikatuna', district: 'District 1' as const, barangays: ['Abucay Norte', 'Abucay Sur', 'Bahi', 'Cambuac Norte', 'Cambuac Sur', 'Poblacion', 'San Isidro', 'San Jose', 'San Martin', 'San Vicente'] },
  { name: 'Tubigon', district: 'District 1' as const, barangays: ['Bosongon', 'Bunacan', 'Cabulihan', 'Cawayanan', 'Centro', 'Guiwanon', 'Ilijan Norte', 'Macaas', 'Mocaboc Island', 'Panadtaran', 'Pinayagan Norte', 'Poblacion', 'Pooc Occidental', 'Tinangnan'] },

  // District 2
  { name: 'Bien Unido', district: 'District 2' as const, barangays: ['Bilangbilangan Dako', 'Hingotanan East', 'Mandawa', 'Malingin', 'Nueva Esperanza', 'Nueva Estrella', 'Pinamgo', 'Poblacion', 'Puerto San Pedro', 'Tuboran'] },
  { name: 'Buenavista', district: 'District 2' as const, barangays: ['Anonang', 'Asuncion', 'Bago', 'Balintaugan', 'Cabulan', 'Cangawa', 'Dait', 'Eastern Cabul-an', 'Hunan', 'Poblacion', 'Rizal', 'Rufo Hill'] },
  { name: 'Clarin', district: 'District 2' as const, barangays: ['Bacani', 'Bogtongbod', 'Bonbon', 'Bontud', 'Buacao', 'Cabog', 'Candajec', 'Lajog', 'Poblacion Centro', 'Poblacion Norte', 'Poblacion Sur', 'Tanghas', 'Tubod'] },
  { name: 'Dagohoy', district: 'District 2' as const, barangays: ['Cagawasan', 'Cagayan', 'Can-oling', 'Candelaria', 'Estaca', 'La Esperanza', 'Mahayag', 'Malitbog', 'Poblacion', 'San Miguel', 'San Vicente', 'Santa Cruz'] },
  { name: 'Danao', district: 'District 2' as const, barangays: ['Cabungahan', 'Cantubod', 'Carbon', 'Concepcion', 'Dagohoy', 'Hibale', 'Magtangtang', 'Poblacion', 'Remedios', 'San Carlos', 'San Miguel', 'Santa Fe', 'Santo Niño'] },
  { name: 'Getafe', district: 'District 2' as const, barangays: ['Alumar', 'Banacon Island', 'Buyog', 'Cabasacan', 'Campao Occidental', 'Handayan Island', 'Jandayan', 'Mahanay', 'Nasingin Island', 'Poblacion', 'Salog', 'San Jose'] },
  { name: 'Inabanga', district: 'District 2' as const, barangays: ['Anonang', 'Badiang', 'Bagohan', 'Bantayan', 'Cagawasan', 'Can-omay', 'Dagnawan', 'Ilaud', 'Lapacan Norte', 'Lawis', 'Nabuad', 'Poblacion', 'Saa', 'Tonggo', 'U-og'] },
  { name: 'President Carlos P. Garcia', district: 'District 2' as const, barangays: ['Aguining', 'Basiao', 'Bawang', 'Butan', 'Campamanog', 'Canmangao', 'Gaus Island', 'Kabankalan', 'Pangapasan', 'Poblacion', 'Popoo', 'San Jose', 'Santo Rosario', 'Tugas', 'Villa Milagrosa'] },
  { name: 'Sagbayan', district: 'District 2' as const, barangays: ['Calangahan', 'Canmano', 'Canmaya Centro', 'Dagnawan', 'Kagawasan', 'Katipunan', 'Langtad', 'Mantalongon', 'Poblacion', 'Sagbayan Sur', 'San Agustin', 'San Isidro', 'San Ramon', 'Santa Catalina'] },
  { name: 'San Isidro', district: 'District 2' as const, barangays: ['Abehulan', 'Baryong Daan', 'Baunos', 'Cabanugan', 'Cansague Norte', 'Cansague Sur', 'Causwagan Sur', 'Masonoy', 'Poblacion'] },
  { name: 'San Miguel', district: 'District 2' as const, barangays: ['Bayongan', 'Bugang', 'Cabangahan', 'Cal-unan', 'Capayas', 'Corazon', 'Garcia', 'Kagawasan', 'Mahayag', 'Poblacion', 'San Agustin', 'San Isidro', 'San Jose', 'San Vicente', 'Santo Niño'] },
  { name: 'Talibon', district: 'District 2' as const, barangays: ['Bagacay', 'Balintawak', 'Burgos', 'Busalian', 'Calituban Island', 'Cataban Island', 'Guindacpan Island', 'Magsaysay', 'Nocnocan Island', 'Poblacion', 'Rizal', 'San Agustin', 'San Carlos', 'San Francisco', 'San Pedro', 'San Roque', 'Santo Niño', 'Sikatuna', 'Suba', 'Tanghaligue', 'Zamora'] },
  { name: 'Trinidad', district: 'District 2' as const, barangays: ['Banlasan', 'Bongbong', 'Catoogan', 'Guinobatan', 'Hinlayagan Ilaud', 'Hinlayagan Ilaya', 'Kauswagan', 'Kinamambagan', 'La Union', 'Mabuhay Cabigohan', 'Mahagbu', 'Poblacion', 'San Isidro', 'San Jose', 'San Vicente', 'Soom', 'Tagum Norte', 'Tagum Sur'] },
  { name: 'Ubay', district: 'District 2' as const, barangays: ['Achila', 'Bay-ang', 'Biabas', 'Bongbong', 'Bood', 'Buenavista', 'Bulilis', 'Cagayan', 'California', 'Camambugan', 'Camali-an', 'Casate', 'Cuya', 'Fatima', 'Humayhumay', 'Ilihan', 'Imelda', 'Juagdan', 'Lomangog', 'Los Angeles', 'Poblacion', 'San Francisco', 'San Isidro', 'San Pascual', 'San Vicente', 'Sentinela', 'Sinandigan', 'Tapal', 'Tigbao', 'Tubog', 'Tuboran', 'Union'] },

  // District 3
  { name: 'Alicia', district: 'District 3' as const, barangays: ['Cagongcagong', 'Cambaol', 'Cayacay', 'Del Monte', 'Katipunan', 'La Hacienda', 'Mahayag', 'Napo', 'Poblacion', 'Progreso', 'Putlongcam', 'Salvador', 'San Isidro', 'San Roque', 'Sudlon', 'Untaga'] },
  { name: 'Anda', district: 'District 3' as const, barangays: ['Almaria', 'Bacong', 'Badiang', 'Buenasuerte', 'Candabong', 'Casica', 'Katipunan', 'Linawan', 'Poblacion', 'Suba', 'Talisay', 'Tanod', 'Tawid', 'Virgen'] },
  { name: 'Batuan', district: 'District 3' as const, barangays: ['Aloja', 'Cabacnitan', 'Cambacay', 'Cantigdas', 'Garcia', 'Janlud', 'Poblacion Norte', 'Poblacion Sur', 'Poblacion Vieja', 'Quezon', 'Quirino', 'Rizal', 'Rosariohan', 'Behind The Clouds'] },
  { name: 'Bilar', district: 'District 3' as const, barangays: ['Bonifacio', 'Bugang Norte', 'Bugang Sur', 'Cabacnitan', 'Cambigsi', 'Campagao', 'Cansumbol', 'Dagohoy', 'Owac', 'Poblacion', 'Riverside', 'Rizal', 'Roxas', 'Subayon', 'Villa Aurora', 'Villa Suerte', 'Yanaya', 'Zamora'] },
  { name: 'Candijay', district: 'District 3' as const, barangays: ['Abihilan', 'Anoling', 'Boyo-an', 'Cadapdapan', 'Cambane', 'Canawa', 'Cogtong', 'La Union', 'Luan', 'Lungsoda-an', 'Panadtaran', 'Panas', 'Poblacion', 'San Isidro', 'Tambongan', 'Tawid', 'Tubod'] },
  { name: 'Carmen', district: 'District 3' as const, barangays: ['Alegria', 'Biking', 'Buenavista', 'Buenos Aires', 'Calatrava', 'El Progreso', 'El Salvador', 'Guadalupe', 'Katipunan', 'La Libertad', 'La Paz', 'La Salvacion', 'La Victoria', 'Matin-ao', 'Montesuerte', 'Poblacion Norte', 'Poblacion Sur', 'Tambuan', 'Villaflor', 'Villafuerte', 'Villacruz'] },
  { name: 'Dimiao', district: 'District 3' as const, barangays: ['Bakilid', 'Balbalan', 'Banban', 'Bawagan', 'Cabagakian', 'Cabanbanan', 'Cadap-agan', 'Canhayupon', 'Catugasan', 'Guindag-an', 'Limokon Ilaud', 'Poblacion', 'Puangyuta', 'Tanghawan', 'Valentin Holmes'] },
  { name: 'Duero', district: 'District 3' as const, barangays: ['Alejawan', 'Angilan', 'Anibongan', 'Bangwalog', 'Cansuhay', 'Danao', 'Guinsularan', 'Itum', 'Langkis', 'Lobogon', 'Madua Norte', 'Madua Sur', 'Payao', 'Poblacion', 'San Antonio', 'San Pedro', 'Taytay'] },
  { name: 'Garcia Hernandez', district: 'District 3' as const, barangays: ['Abijilan', 'Antipolo', 'Basiao', 'Cagayan', 'Calma', 'Cambuyo', 'Canayaon East', 'Canayaon West', 'Cayam', 'Manaba', 'Pasong', 'Poblacion East', 'Poblacion West', 'Sacaon', 'Sampong', 'Tabuan', 'Victoria'] },
  { name: 'Guindulman', district: 'District 3' as const, barangays: ['Basdio', 'Bato', 'Biabas', 'Bulawan', 'Cabantian', 'Canhaway', 'Cansiwang', 'Casida', 'Catungawan Norte', 'Catungawan Sur', 'Guio-ang', 'Lomboy', 'Mayuga', 'Poblacion', 'Sawang', 'Tabajan', 'Trinidad'] },
  { name: 'Jagna', district: 'District 3' as const, barangays: ['Alejawan', 'Balili', 'Boctol', 'Bunga Ilaya', 'Bunga Mar', 'Cabunga-an', 'Calabacita', 'Can-ipol', 'Can-uba', 'Can-upao', 'Cantagay', 'Cantudan', 'Ipil', 'Looc', 'Malbog', 'Mayana', 'Naatang', 'Nausok', 'Odiong', 'Pagina', 'Pangdan', 'Poblacion', 'Tejero', 'Tubod Mar'] },
  { name: 'Lila', district: 'District 3' as const, barangays: ['Bonkokan Ilaya', 'Bonkokan Ubos', 'Calvario', 'Candulang', 'Catugasan', 'Cayupo', 'Cogon', 'Jambawan', 'La Fortuna', 'Lomanoy', 'Macalingao', 'Malinao East', 'Malinao West', 'Natusan', 'Poblacion', 'San Francisco', 'Taug', 'Tubod'] },
  { name: 'Loay', district: 'District 3' as const, barangays: ['Agape', 'Alegria Norte', 'Alegria Sur', 'Bonbon', 'Botoc Occidental', 'Botoc Oriental', 'Calvario', 'Concepcion', 'Hinawanan', 'Las Salinas Norte', 'Las Salinas Sur', 'Palo', 'Poblacion Ibabao', 'Poblacion Ubos', 'Sagnap', 'Tayong Occidental', 'Tayong Oriental', 'Tocdog Daku', 'Tocdog Gamay', 'Villalimpia', 'Yanambao'] },
  { name: 'Loboc', district: 'District 3' as const, barangays: ['Agape', 'Alegria', 'Bagumbayan', 'Bahian', 'Bungahan', 'Calunasan Norte', 'Calunasan Sur', 'Camayaan', 'Candasag', 'Canlasid', 'Gon-ob', 'Gotozon', 'Jimilian', 'Oy', 'Poblacion Sawang', 'Poblacion Ondol', 'Quinoguitan', 'Taytay', 'Tigbao', 'Ugpong', 'Valladolid'] },
  { name: 'Mabini', district: 'District 3' as const, barangays: ['Abaca', 'Baybayon', 'Bulawan', 'Cabangahan', 'Cawayanan', 'Concepcion', 'Del Mar', 'Lungsoda-an', 'Minolos', 'Poblacion', 'San Isidro', 'San Jose', 'San Rafael', 'San Roque', 'Tambo', 'Tangkigan', 'Valaga'] },
  { name: 'Pilar', district: 'District 3' as const, barangays: ['Aurora', 'Bagacay', 'Bagumbayan', 'Bayong', 'Buenasuerte', 'Cagawasan', 'Cansungay', 'Catagda-an', 'Del Pilar', 'Esperanza', 'Estaca', 'Ilaud', 'Inaghuban', 'Lumbay', 'Lundag', 'Poblacion', 'Rizal', 'San Carlos', 'San Isidro', 'San Vicente'] },
  { name: 'Sevilla', district: 'District 3' as const, barangays: ['Bayawahan', 'Cabancaban', 'Calinginan Norte', 'Calinginan Sur', 'Cambagui', 'Ewon', 'Guinob-an', 'Lagtangan', 'Licolico', 'Lobgob', 'Malingin', 'Poblacion', 'Tapikan'] },
  { name: 'Sierra Bullones', district: 'District 3' as const, barangays: ['Abachanan', 'Anibongan', 'Bugsoc', 'Cahayag', 'Canlangit', 'Cansilao', 'Danicop', 'Dusita', 'La Union', 'Lataban', 'Magsaysay', 'Man-Calculita', 'Poblacion', 'Salvador', 'San Agustin', 'San Isidro', 'San Jose', 'San Juan', 'Santa Cruz', 'Villa Garcia'] },
  { name: 'Valencia', district: 'District 3' as const, barangays: ['Adlawan', 'Anislag', 'Anonang', 'Balingasag', 'Banship', 'Bantolinao', 'Buyog', 'Candavit', 'Can-ingay', 'Can-Olin', 'Cansibao', 'Catug-an', 'Cutcutan', 'Dana-ao', 'Genoveva', 'Maubo', 'Nailo', 'Omjon', 'Poblacion Occidental', 'Poblacion Oriental', 'Simang', 'Taug Norte', 'Taug Sur', 'Taytay'] },
];

export const PHILIPPINES_REGIONS: GeoRegion[] = [
  {
    name: 'Region VII (Central Visayas)',
    code: 'REGION-VII',
    provinces: [
      {
        name: 'Bohol',
        municipalities: boholMunicipalities,
      },
      {
        name: 'Cebu',
        municipalities: [
          { name: 'Cebu City', barangays: ['Lahug', 'Mabolo', 'Guadalupe', 'Banilad', 'Talamban', 'Kamputhaw', 'Poblacion'] },
          { name: 'Mandaue City', barangays: ['Subangdaku', 'Tipolo', 'Centro', 'Banilad', 'Bakilid', 'Maguikay'] },
          { name: 'Lapu-Lapu City', barangays: ['Punta Engaño', 'Maribago', 'Basak', 'Pajo', 'Mactan', 'Pusok'] },
          { name: 'Talisay City', barangays: ['Dumlog', 'Poblacion', 'Bulacao', 'Lawaan I', 'Tabunok'] },
        ],
      },
      {
        name: 'Negros Oriental',
        municipalities: [
          { name: 'Dumaguete City', barangays: ['Piapi', 'Bantayan', 'Poblacion 1', 'Bagacay', 'Mangnao-Canlaro', 'Taclobo'] },
          { name: 'Bais City', barangays: ['Hangyad', 'Olympia', 'Poblacion', 'Panala-an', 'Talungon'] },
        ],
      },
      {
        name: 'Siquijor',
        municipalities: [
          { name: 'Siquijor', barangays: ['Cang-alwang', 'Caipilan', 'Poblacion', 'Ponong', 'Tacdog'] },
          { name: 'Larena', barangays: ['Bagacay', 'Bintangan', 'Nonoc', 'Poblacion', 'Sandugan'] },
        ],
      },
    ],
  },
  {
    name: 'National Capital Region (NCR)',
    code: 'NCR',
    provinces: [
      {
        name: 'Metro Manila',
        municipalities: [
          { name: 'Manila', barangays: ['Barangay 659 (Ermita)', 'Barangay 660 (Intramuros)', 'Barangay 395 (Sampaloc)', 'Barangay 830 (Pandacan)', 'Barangay 281 (Binondo)'] },
          { name: 'Quezon City', barangays: ['Batasan Hills', 'Diliman', 'Commonwealth', 'Loyola Heights', 'Kamuning', 'Tatalon'] },
          { name: 'Makati City', barangays: ['Bel-Air', 'Poblacion', 'San Lorenzo', 'Pio del Pilar', 'Bangkal', 'Guadalupe Nuevo'] },
          { name: 'Taguig City', barangays: ['Fort Bonifacio (BGC)', 'Ususan', 'Pinagsama', 'Western Bicutan', 'Tuktukan'] },
          { name: 'Pasig City', barangays: ['San Antonio (Ortigas)', 'Kapitolyo', 'Ugong', 'Caniogan', 'Maybunga'] },
        ],
      },
    ],
  },
  {
    name: 'Region I (Ilocos Region)',
    code: 'REGION-I',
    provinces: [
      {
        name: 'Ilocos Norte',
        municipalities: [
          { name: 'Laoag City', barangays: ['Barangay 1 (San Lorenzo)', 'Barangay 2 (Santa Joaquina)', 'Nalbo', 'Barit'] },
          { name: 'Batac City', barangays: ['Ablan', 'Acosta', 'Ben-agan', 'Palpalicong'] },
        ],
      },
      {
        name: 'Pangasinan',
        municipalities: [
          { name: 'Dagupan City', barangays: ['Pantal', 'Bonuan Gueset', 'Tapuac', 'Lucao'] },
          { name: 'Lingayen', barangays: ['Poblacion', 'Maniboc', 'Pangapisan North', 'Baay'] },
        ],
      },
    ],
  },
  {
    name: 'Region II (Cagayan Valley)',
    code: 'REGION-II',
    provinces: [
      {
        name: 'Cagayan',
        municipalities: [
          { name: 'Tuguegarao City', barangays: ['Centro 01', 'Carig Sur', 'Buntun', 'Ugac Sur'] },
        ],
      },
      {
        name: 'Isabela',
        municipalities: [
          { name: 'Ilagan City', barangays: ['Centro Poblacion', 'Alibagu', 'Marana 1st', 'Osmeña'] },
        ],
      },
    ],
  },
  {
    name: 'Region III (Central Luzon)',
    code: 'REGION-III',
    provinces: [
      {
        name: 'Pampanga',
        municipalities: [
          { name: 'San Fernando City', barangays: ['Dolores', 'San Jose', 'San Agustin', 'Sindalan'] },
          { name: 'Angeles City', barangays: ['Balibago', 'Malabanias', 'Cutcut', 'Sto. Rosario'] },
        ],
      },
      {
        name: 'Bulacan',
        municipalities: [
          { name: 'Malolos City', barangays: ['Catmon', 'San Gabriel', 'Sto. Rosario', 'Guinhawa'] },
          { name: 'San Jose del Monte City', barangays: ['Muzon', 'Tungkong Mangga', 'Graceville', 'Kaypian'] },
        ],
      },
    ],
  },
  {
    name: 'Region IV-A (CALABARZON)',
    code: 'REGION-IV-A',
    provinces: [
      {
        name: 'Cavite',
        municipalities: [
          { name: 'Imus City', barangays: ['Bucandala', 'Malagasang 1st', 'Palico', 'Poblacion'] },
          { name: 'Dasmariñas City', barangays: ['Salitran', 'Burol', 'Zone 1', 'Paliparan'] },
          { name: 'Tagaytay City', barangays: ['Kaybagal South', 'Mendez Crossing East', 'Maharlika East', 'Silang Junction'] },
        ],
      },
      {
        name: 'Laguna',
        municipalities: [
          { name: 'Calamba City', barangays: ['Canlubang', 'Parian', 'Real', 'Halang'] },
          { name: 'Santa Rosa City', barangays: ['Balibago', 'Don Jose', 'Tagapo', 'Dila'] },
        ],
      },
    ],
  },
  {
    name: 'MIMAROPA Region',
    code: 'MIMAROPA',
    provinces: [
      {
        name: 'Palawan',
        municipalities: [
          { name: 'Puerto Princesa City', barangays: ['San Pedro', 'San Jose', 'Bancao-Bancao', 'Santa Monica'] },
          { name: 'Coron', barangays: ['Poblacion 1', 'Banuang Daan', 'Tagumpay', 'Marcilla'] },
        ],
      },
      {
        name: 'Oriental Mindoro',
        municipalities: [
          { name: 'Calapan City', barangays: ['Ilaya', 'San Vicente Central', 'Ibaba West', 'Salong'] },
        ],
      },
    ],
  },
  {
    name: 'Region V (Bicol Region)',
    code: 'REGION-V',
    provinces: [
      {
        name: 'Albay',
        municipalities: [
          { name: 'Legazpi City', barangays: ['Rawis', 'Bitano', 'Gogon', 'Albay District'] },
        ],
      },
      {
        name: 'Camarines Sur',
        municipalities: [
          { name: 'Naga City', barangays: ['Concepcion Pequeña', 'Triangulo', 'Magsaysay', 'Poblacion'] },
        ],
      },
    ],
  },
  {
    name: 'Region VI (Western Visayas)',
    code: 'REGION-VI',
    provinces: [
      {
        name: 'Iloilo',
        municipalities: [
          { name: 'Iloilo City', barangays: ['Mandurriao', 'Jaro', 'Molo', 'La Paz', 'City Proper'] },
        ],
      },
      {
        name: 'Negros Occidental',
        municipalities: [
          { name: 'Bacolod City', barangays: ['Mandalagan', 'Singcang-Airport', 'Villamonte', 'Mansilingan', 'Taculing'] },
        ],
      },
    ],
  },
  {
    name: 'Region VIII (Eastern Visayas)',
    code: 'REGION-VIII',
    provinces: [
      {
        name: 'Leyte',
        municipalities: [
          { name: 'Tacloban City', barangays: ['Downtown', 'Marasbaras', 'San Jose', 'V&G Subdivision'] },
          { name: 'Ormoc City', barangays: ['Cogon', 'Can-adieng', 'Punta', 'Linao'] },
        ],
      },
      {
        name: 'Samar',
        municipalities: [
          { name: 'Catbalogan City', barangays: ['Poblacion 1', 'Ubanon-Boao', 'Canlapwas', 'Mercedes'] },
        ],
      },
    ],
  },
  {
    name: 'Region IX (Zamboanga Peninsula)',
    code: 'REGION-IX',
    provinces: [
      {
        name: 'Zamboanga del Sur',
        municipalities: [
          { name: 'Zamboanga City', barangays: ['Pasonanca', 'Tetuan', 'Santa Maria', 'Tumaga', 'Canelar'] },
          { name: 'Pagadian City', barangays: ['Gatas', 'San Jose', 'Tiguma', 'Balangasan'] },
        ],
      },
    ],
  },
  {
    name: 'Region X (Northern Mindanao)',
    code: 'REGION-X',
    provinces: [
      {
        name: 'Misamis Oriental',
        municipalities: [
          { name: 'Cagayan de Oro City', barangays: ['Carmen', 'Lapasan', 'Macasandig', 'Kauswagan', 'Nazareth'] },
        ],
      },
      {
        name: 'Bukidnon',
        municipalities: [
          { name: 'Malaybalay City', barangays: ['Casig-an', 'Sumpong', 'Casisang', 'Poblacion'] },
        ],
      },
    ],
  },
  {
    name: 'Region XI (Davao Region)',
    code: 'REGION-XI',
    provinces: [
      {
        name: 'Davao del Sur',
        municipalities: [
          { name: 'Davao City', barangays: ['Poblacion', 'Buhangin', 'Matina Crossing', 'Talomo', 'Toril', 'Agdao'] },
        ],
      },
      {
        name: 'Davao del Norte',
        municipalities: [
          { name: 'Tagum City', barangays: ['Magugpo Poblacion', 'Visayan Village', 'Mankilam', 'Apokon'] },
        ],
      },
    ],
  },
  {
    name: 'Region XII (SOCCSKSARGEN)',
    code: 'REGION-XII',
    provinces: [
      {
        name: 'South Cotabato',
        municipalities: [
          { name: 'General Santos City', barangays: ['Lagao', 'Calumpang', 'Dadiangas North', 'Apopong', 'Bula'] },
          { name: 'Koronadal City', barangays: ['General Paulino Santos', 'Morales', 'Zone III', 'Carpenter Hill'] },
        ],
      },
    ],
  },
  {
    name: 'Region XIII (Caraga)',
    code: 'REGION-XIII',
    provinces: [
      {
        name: 'Agusan del Norte',
        municipalities: [
          { name: 'Butuan City', barangays: ['Libertad', 'Villa Kananga', 'Doongan', 'Holy Redeemer'] },
        ],
      },
      {
        name: 'Surigao del Norte',
        municipalities: [
          { name: 'Surigao City', barangays: ['Washington', 'Taft', 'Luna', 'San Juan'] },
        ],
      },
    ],
  },
  {
    name: 'Cordillera Administrative Region (CAR)',
    code: 'CAR',
    provinces: [
      {
        name: 'Benguet',
        municipalities: [
          { name: 'Baguio City', barangays: ['Camp 7', 'Session Road-Poblacion', 'Loakan', 'Irisan', 'Bakakeng Central'] },
          { name: 'La Trinidad', barangays: ['Poblacion', 'Betag', 'Balili', 'Puguis'] },
        ],
      },
    ],
  },
  {
    name: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
    code: 'BARMM',
    provinces: [
      {
        name: 'Maguindanao del Norte',
        municipalities: [
          { name: 'Cotabato City', barangays: ['Rosary Heights', 'Poblacion 1', 'Tamontaka', 'Bagua'] },
        ],
      },
      {
        name: 'Lanao del Sur',
        municipalities: [
          { name: 'Marawi City', barangays: ['Banggolo Poblacion', 'Saduc', 'Datu Saber', 'Matampay'] },
        ],
      },
    ],
  },
];

export function getRegions(): string[] {
  return PHILIPPINES_REGIONS.map((r) => r.name);
}

export function getProvinces(regionName: string): string[] {
  const reg = PHILIPPINES_REGIONS.find((r) => r.name === regionName);
  return reg ? reg.provinces.map((p) => p.name) : [];
}

export function getMunicipalities(provinceName: string): string[] {
  for (const reg of PHILIPPINES_REGIONS) {
    const prov = reg.provinces.find((p) => p.name === provinceName);
    if (prov) {
      return prov.municipalities.map((m) => m.name);
    }
  }
  return [];
}

export function getBarangays(municipalityName: string): string[] {
  for (const reg of PHILIPPINES_REGIONS) {
    for (const prov of reg.provinces) {
      const muni = prov.municipalities.find((m) => m.name === municipalityName);
      if (muni) {
        return muni.barangays;
      }
    }
  }
  return ['Poblacion', 'Barangay 1', 'San Jose', 'San Isidro', 'Santa Cruz'];
}
