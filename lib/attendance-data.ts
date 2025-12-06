export interface Student {
  rollNo: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  type: 'theory' | 'lab';
}

export interface AttendanceRecord {
  date: string;
  time: string;
  numberOfClasses: number;
  notes: string;
  absentStudents: string[];
}

export interface SubjectAttendance {
  [subjectId: string]: AttendanceRecord[];
}

export const TIME_SLOTS = [
  "8:40 AM",
  "9:30 AM",
  "10:20 AM",
  "11:10 AM",
  "12:00 PM",
  "12:50 PM",
  "1:40 PM",
  "2:30 PM",
];

export const SUBJECTS: Subject[] = [
  { id: "ai", name: "Artificial Intelligence", shortName: "AI", type: "theory" },
  { id: "cc", name: "Cloud Computing", shortName: "CC", type: "theory" },
  { id: "dl", name: "Deep Learning", shortName: "DL", type: "theory" },
  { id: "eitk", name: "Essence of Indian Traditional Knowledge", shortName: "EITK", type: "theory" },
  { id: "nlp", name: "Natural Language Processing", shortName: "NLP", type: "theory" },
  { id: "ai-lab", name: "Artificial Intelligence Lab", shortName: "AI Lab", type: "lab" },
  { id: "dv-lab", name: "Data Visualization Lab", shortName: "DV Lab", type: "lab" },
  { id: "dl-lab", name: "Deep Learning Lab", shortName: "DL Lab", type: "lab" },
  { id: "iot-lab", name: "Internet of Things Lab", shortName: "IoT Lab", type: "lab" },
];

export const STUDENTS: Student[] = [
  { rollNo: "322103383022", name: "GANGAVASAM MAHITH SAI DEV" },
  { rollNo: "323103383001", name: "AKELLA ADITYA REVANTH" },
  { rollNo: "323103383002", name: "ALABOYINA MEGHANA" },
  { rollNo: "323103383003", name: "ALAJINGI S V D SAILAJA KEERTHI" },
  { rollNo: "323103383004", name: "ALLA YASWITHA" },
  { rollNo: "323103383005", name: "AMITI GEETHIKA" },
  { rollNo: "323103383006", name: "ANNEPU AVINASH" },
  { rollNo: "323103383007", name: "ARJI CHANUKYA" },
  { rollNo: "323103383008", name: "BADIGANTI TEJASRI" },
  { rollNo: "323103383009", name: "BALIVADA PAVANI" },
  { rollNo: "323103383010", name: "BALLA UMA PRANEETH" },
  { rollNo: "323103383011", name: "BANISETTI SYAM CHAND" },
  { rollNo: "323103383012", name: "BOJA MOUNIKA" },
  { rollNo: "323103383013", name: "BRAHMASA PRANATHI" },
  { rollNo: "323103383014", name: "BUGATHA MOUNIKA" },
  { rollNo: "323103383015", name: "CHEBIYYAM SURYA TEJA SASIDHAR" },
  { rollNo: "323103383016", name: "CHILAKAMARRI VARDHAN" },
  { rollNo: "323103383017", name: "DADI JOGESH" },
  { rollNo: "323103383018", name: "DALAI PARVATHI" },
  { rollNo: "323103383019", name: "DANGETI SRINIVASA PRANAVAN" },
  { rollNo: "323103383020", name: "DONTHAMSETTI YESESWI NAVYA NANDHITHA" },
  { rollNo: "323103383021", name: "DUNNA HARSHA VARDHAN" },
  { rollNo: "323103383022", name: "GALI SURYA CHAITANYA" },
  { rollNo: "323103383023", name: "GEDDA POOJITHA" },
  { rollNo: "323103383024", name: "GEMBALI AMRUTHA VARSHINI" },
  { rollNo: "323103383025", name: "GURRAM BHAVANA" },
  { rollNo: "323103383026", name: "INADA SAI" },
  { rollNo: "323103383027", name: "IPPILI NAVYA" },
  { rollNo: "323103383028", name: "KAMBALA JEEVAN SRI SAI MANOHAR" },
  { rollNo: "323103383029", name: "KARETI HARINI SREE" },
  { rollNo: "323103383030", name: "KASAPU VARSHITHA RAMYA" },
  { rollNo: "323103383031", name: "KAVYA SRI KASPA" },
  { rollNo: "323103383032", name: "KINTALI VENKATA DHANASHREE VALLI" },
  { rollNo: "323103383033", name: "KODURI DEVI SAHITHI" },
  { rollNo: "323103383034", name: "KOLLI SAI NARENDRA" },
  { rollNo: "323103383035", name: "KOTTA VENKATA RATNA KARTHIK" },
  { rollNo: "323103383036", name: "KURUVELLA SHANMUKHA PRANAV" },
  { rollNo: "323103383037", name: "LAGUDU TEJASWI" },
  { rollNo: "323103383038", name: "LANKALAPALLI KUMAR" },
  { rollNo: "323103383039", name: "MANTRI LAHARI" },
  { rollNo: "323103383040", name: "MORA LAVANYA LAKSHMI" },
  { rollNo: "323103383041", name: "MULAGADA VAMSI" },
  { rollNo: "323103383042", name: "MUNI SRAVAN" },
  { rollNo: "323103383043", name: "MUTCHERLA PURANDISH" },
  { rollNo: "323103383044", name: "NALLABALLE SATYASWAROOP REDDY" },
  { rollNo: "323103383045", name: "NALLI SRUTHI" },
  { rollNo: "323103383046", name: "PALANCHU KUNALSRI" },
  { rollNo: "323103383047", name: "PALAVALASA SIVA KUMAR" },
  { rollNo: "323103383048", name: "PATTA KAVYA" },
  { rollNo: "323103383049", name: "PUPPALA SIVA SAI SASANK" },
  { rollNo: "323103383050", name: "RAJANA HEMA VARSHINI" },
  { rollNo: "323103383051", name: "RALLAPALLI SHANMUKHA ADITYA" },
  { rollNo: "323103383052", name: "REPALLE NAGA SAI NIKHIL" },
  { rollNo: "323103383053", name: "RUTTALA PRAVEENPRAKASH" },
  { rollNo: "323103383054", name: "RUTTALA SAGAR" },
  { rollNo: "323103383055", name: "SATAKA JOSHNAVI" },
  { rollNo: "323103383056", name: "SEEPANA CHARITH" },
  { rollNo: "323103383057", name: "SEERAPU BHAVANI" },
  { rollNo: "323103383058", name: "SHAIK YASEEN" },
  { rollNo: "323103383059", name: "SRIRANGAM REETHIKA DEVI" },
  { rollNo: "323103383060", name: "TANDYANA SARVANI" },
  { rollNo: "323103383061", name: "THUTHIKA VENKATA YASHASHVINI" },
  { rollNo: "323103383063", name: "VARANASI VENKATA SAI ADITHYA" },
  { rollNo: "323103383064", name: "YEDLA PARNIKA" },
  { rollNo: "324103383L01", name: "GANDHAM RAMYA HARSHITHA" },
  { rollNo: "324103383L02", name: "GANTEDA YAGNESWARASAI" },
  { rollNo: "324103383L03", name: "PENTAKOTA POORNA CHANDRA RAO" },
  { rollNo: "324103383L04", name: "PONNADA HARSHITA" },
  { rollNo: "324103383L05", name: "PURITIGADDA VIVEK" },
  { rollNo: "324103383L06", name: "THIRU HARIKA ITTA" },
  { rollNo: "21131A4417", name: "K SIVA DATTA KARTHIKEYA" },
];

export function getAttendancePercentageColor(percentage: number): string {
  if (percentage < 65) return "text-red-600 bg-red-50";
  if (percentage <= 75) return "text-yellow-600 bg-yellow-50";
  return "text-green-600 bg-green-50";
}

export function getAttendanceBadgeColor(percentage: number): string {
  if (percentage < 65) return "bg-red-500 text-white";
  if (percentage <= 75) return "bg-yellow-500 text-white";
  return "bg-green-500 text-white";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
