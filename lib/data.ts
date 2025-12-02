import { BookOpen, Award, Star, Globe } from 'lucide-react';

// --- Types ---

export interface User {
  uid?: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export interface Question {
  id: number;
  text: string;
  options: string[]; 
  correctAnswer: number; 
}

export interface Exam {
  id: number;
  type: 'First Attempt' | 'Retake';
  questions: Question[];
}

export interface Task {
  id: number;
  title: string;
  exams: Exam[];
}

export interface Module {
  title: string;
  videoUrl: string;
  duration: string;
  linkedTaskId?: number;
}

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Course {
  id: number;
  title: string;
  partner: string;
  type: string;
  rating: number; 
  reviews: string; 
  level: string;
  duration: string;
  students: string; 
  
  enrollmentCount?: number; 
  reviewsList?: Review[];

  imageColor: string;
  thumbnail?: string;
  category: string;
  skills: string[];
  description: string;
  
  syllabus: Module[];
  tasks: Task[];
  
  isOffline?: boolean;
  location?: string;
  schedule?: string;
  
  passingGrade?: number;
}

// --- Constants ---

export const CATEGORIES = [
  "Bisnis & UMKM", "Keterampilan Menjahit", "Pemasaran Digital", 
  "Keuangan", "Pengembangan Diri", "Keterampilan Vokasi"
];

// --- Mock Data Generators based on uploaded files ---

// 1. Course: Memulai Bisnis (From SOAL DAN JAWABAN (PANGKEP) (MEMULAI BISNIS).docx)
const businessExamQuestions: Question[] = [
  {
    id: 1,
    text: "Apa keuntungan utama memulai usaha dengan modal kecil?",
    options: [
      "Risiko finansial lebih rendah dan fleksibel",
      "Langsung mendapatkan keuntungan besar instan",
      "Tidak perlu memikirkan strategi pemasaran",
      "Bisa merekrut banyak karyawan sekaligus"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    text: "Manakah contoh ide usaha yang cocok untuk modal kecil?",
    options: [
      "Membuka pabrik manufaktur besar",
      "Jualan online atau usaha rumahan",
      "Membeli franchise restoran internasional",
      "Impor kendaraan bermotor"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "Menurut materi, apa yang lebih penting daripada modal besar?",
    options: [
      "Koneksi dengan pejabat",
      "Lokasi toko yang sangat mahal",
      "Kemauan untuk mulai dan konsistensi",
      "Ijazah pendidikan tinggi"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    text: "Apa keunggulan utama dari model bisnis Affiliate Marketing?",
    options: [
      "Harus stok barang di gudang sendiri",
      "Merekomendasikan produk orang lain tanpa modal stok",
      "Wajib membuat produk sendiri dari nol",
      "Membutuhkan toko fisik yang besar"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    text: "Apa kunci utama dalam membangun penghasilan pasif (passive income)?",
    options: [
      "Berhenti bekerja segera setelah mulai",
      "Sabar dan Konsisten membangun sistem",
      "Meminjam uang sebanyak mungkin",
      "Mengandalkan keberuntungan semata"
    ],
    correctAnswer: 1
  }
];

// 2. Course: Menjahit (From Tugas Ujian Kompetensi Menjahit.docx)
const sewingExamQuestions: Question[] = [
  {
    id: 1,
    text: "Jenis tusuk tangan yang digunakan untuk menyatukan dua lapis kain sementara sebelum dijahit mesin disebut...",
    options: ["Tusuk tikam jejak", "Tusuk jelujur", "Tusuk feston", "Tusuk silang"],
    correctAnswer: 1 
  },
  {
    id: 2,
    text: "Tusuk yang digunakan untuk menguatkan ujung saku atau ujung lengan agar tidak melar adalah...",
    options: ["Tusuk tikam jejak", "Tusuk tangkai", "Tusuk kelim", "Tusuk rantai"],
    correctAnswer: 2 
  },
  {
    id: 3,
    text: "Tusuk hias yang berbentuk lingkaran kecil-kecil dan sering digunakan pada bordir adalah...",
    options: ["Tusuk silang", "Tusuk rantai", "Tusuk jelujur", "Tusuk bordir (French knot)"],
    correctAnswer: 3
  },
  {
    id: 4,
    text: "Alat utama yang digunakan untuk menjahit celana sobek secara manual adalah...",
    options: ["Mesin Obras", "Lem Kain", "Jarum dan Benang", "Stapler"],
    correctAnswer: 2
  },
  {
    id: 5,
    text: "Jenis jahitan yang paling cocok untuk memperbaiki sobekan kecil pada celana jeans adalah...",
    options: ["Jahitan feston", "Jahitan tikam jejak", "Jahitan rantai", "Jahitan jelujur"],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "Apa fungsi utama kantong samping pada celana?",
    options: ["Sebagai hiasan", "Menambah berat celana", "Tempat menyimpan barang kecil", "Memperkuat jahitan celana"],
    correctAnswer: 2
  },
  {
    id: 7,
    text: "Apa tujuan utama membuat pola baju anak sebelum menjahit?",
    options: ["Mempercepat proses menjahit", "Menghemat kain", "Memastikan ukuran dan model sesuai", "Menghindari kesalahan desain"],
    correctAnswer: 2
  }
];

// 3. Course: UMKM (From Modul Pelatihan UMKM_IRAWATI HM.docx)
const umkmExamQuestions: Question[] = [
  {
    id: 1,
    text: "Mengapa laporan keuangan penting bagi UMKM?",
    options: [
      "Hanya untuk formalitas pajak",
      "Mengetahui posisi laba, rugi, dan aset usaha",
      "Agar terlihat keren di depan teman",
      "Tidak terlalu penting untuk usaha kecil"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "Apa perbedaan utama pencatatan keuangan sistem digital dibandingkan manual?",
    options: [
      "Digital lebih rumit dan lambat",
      "Manual lebih aman dari kerusakan",
      "Digital otomatis menghitung dan mengurangi human error",
      "Manual tidak membutuhkan alat tulis"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    text: "Apa manfaat utama menggunakan QRIS bagi UMKM?",
    options: [
      "Hanya bisa menerima pembayaran dari satu bank",
      "Menerima pembayaran dari semua aplikasi bank/e-wallet",
      "Biaya transaksi sangat mahal",
      "Proses pencairan dana memakan waktu sebulan"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "Apa fungsi utama aplikasi SIAPIK?",
    options: [
      "Mengedit foto produk",
      "Mencatat transaksi dan membuat laporan keuangan otomatis",
      "Membuat logo usaha",
      "Mencari karyawan baru"
    ],
    correctAnswer: 1
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    title: "Strategi Memulai Bisnis Modal Kecil",
    partner: "Pangkep Entrepreneurship",
    type: "Course",
    rating: 4.8,
    reviews: "1.5k",
    level: "Pemula",
    duration: "4 Minggu",
    students: "3.2k",
    enrollmentCount: 3200,
    reviewsList: [],
    imageColor: "bg-blue-600",
    category: "Bisnis & UMKM",
    skills: ["Perencanaan Bisnis", "Pemasaran Digital", "Manajemen Keuangan", "Mindset Wirausaha"],
    description: "Pelajari cara memulai usaha dari nol dengan modal minim. Kursus ini mencakup ide bisnis digital, kerja sampingan tanpa modal, dan konsep passive income.",
    passingGrade: 70,
    syllabus: [
      { 
        title: "Mulai Usaha Cuma Modal Kecil?", 
        videoUrl: "https://www.youtube.com/embed/ebczm2j82CM", 
        duration: "15m",
        linkedTaskId: 101 
      },
      { 
        title: "3 Ide Bisnis Digital Tanpa Modal", 
        videoUrl: "https://www.youtube.com/embed/RoaQEZdlCBQ", 
        duration: "20m" 
      },
      { 
        title: "3 Ide Kerja Sampingan Tanpa Modal", 
        videoUrl: "https://www.youtube.com/embed/834yVc8m7fc", 
        duration: "18m" 
      },
      { 
        title: "Konsep Passive Income: Biarkan Uang Bekerja", 
        videoUrl: "https://www.youtube.com/embed/Zdi2X9xd5_s", 
        duration: "25m",
        linkedTaskId: 102
      }
    ],
    tasks: [
      { 
        id: 101, 
        title: "Kuis: Mindset & Ide Bisnis", 
        exams: [
          { id: 1, type: 'First Attempt', questions: businessExamQuestions },
          { id: 2, type: 'Retake', questions: businessExamQuestions }
        ]
      },
      { 
        id: 102, 
        title: "Ujian Akhir: Perencanaan Bisnis", 
        exams: [
          { id: 3, type: 'First Attempt', questions: businessExamQuestions },
          { id: 4, type: 'Retake', questions: businessExamQuestions }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Kursus Kompetensi Menjahit Dasar",
    partner: "Lembaga Kursus Menjahit",
    type: "Professional Certificate",
    rating: 4.9,
    reviews: "500",
    level: "Pemula",
    duration: "8 Minggu",
    students: "1.1k",
    enrollmentCount: 1100,
    reviewsList: [],
    imageColor: "bg-pink-600",
    category: "Keterampilan Menjahit",
    skills: ["Tusuk Dasar", "Perbaikan Pakaian", "Pola Baju", "Menjahit Celana"],
    description: "Panduan lengkap menjahit untuk pemula. Mulai dari pengenalan alat, tusuk dasar, hingga memperbaiki pakaian sobek dan membuat pola baju anak.",
    passingGrade: 75,
    syllabus: [
      { title: "Tusuk Dasar Menjahit", videoUrl: "https://www.youtube.com/embed/TkHcsDa3-Qw", duration: "10m" },
      { title: "Tusuk Anak Tangga dan Sembunyi", videoUrl: "https://www.youtube.com/embed/8KNisRpeGDg", duration: "12m", linkedTaskId: 201 },
      { title: "Menjahit untuk Pemula", videoUrl: "https://www.youtube.com/embed/2effpUJQMEI", duration: "15m" },
      { title: "Peralatan Jahit Dasar", videoUrl: "https://www.youtube.com/embed/0mMu6jOo6Qk", duration: "8m" },
      { title: "Menjahit Celana Sobek", videoUrl: "https://www.youtube.com/embed/8NHfHHrElUk", duration: "20m" },
      { title: "Menambal Celana", videoUrl: "https://www.youtube.com/embed/4_XNo4iPI-4", duration: "10m" },
      { title: "Cara Menjahit Celana Anak Tanpa Pola", videoUrl: "https://www.youtube.com/embed/aUb54xWUE50", duration: "25m" },
      { title: "Memasang Kantong Samping", videoUrl: "https://www.youtube.com/embed/aMmpN-KLkwU", duration: "15m" },
      { title: "Membuat Pola Baju Anak", videoUrl: "https://www.youtube.com/embed/aoDo1WSseVY", duration: "30m", linkedTaskId: 202 },
      { title: "Tips Menjahit Jeans", videoUrl: "https://www.youtube.com/embed/P8FEalWgNp0", duration: "12m" }
    ],
    tasks: [
      { 
        id: 201, 
        title: "Kuis: Teknik Dasar Menjahit", 
        exams: [
          { id: 21, type: 'First Attempt', questions: sewingExamQuestions.slice(0, 3) },
          { id: 22, type: 'Retake', questions: sewingExamQuestions.slice(0, 3) }
        ]
      },
      { 
        id: 202, 
        title: "Ujian Kompetensi Akhir", 
        exams: [
          { id: 23, type: 'First Attempt', questions: sewingExamQuestions },
          { id: 24, type: 'Retake', questions: sewingExamQuestions }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Manajemen Keuangan & Digitalisasi UMKM",
    partner: "Dinas Koperasi & UMKM",
    type: "Workshop",
    rating: 4.7,
    reviews: "200",
    level: "Menengah",
    duration: "2 Hari (Offline/Materi)",
    students: "450",
    enrollmentCount: 450,
    reviewsList: [],
    imageColor: "bg-purple-600",
    category: "Bisnis & UMKM",
    skills: ["Laporan Keuangan", "QRIS", "Aplikasi SIAPIK", "Digital Payment"],
    description: "Pelatihan khusus UMKM untuk meningkatkan literasi keuangan, penggunaan pembayaran digital (QRIS), dan aplikasi pencatatan keuangan.",
    passingGrade: 80,
    syllabus: [
      { title: "Pentingnya Laporan Keuangan Bagi UMKM", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "30m" }, // Placeholder video as none provided
      { title: "Literasi Keuangan Manual & Sistem Laba Rugi", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "45m" },
      { title: "Cara Membuat QRIS Semua Pembayaran", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "20m" },
      { title: "Tutorial Aplikasi SIAPIK", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "40m", linkedTaskId: 301 }
    ],
    tasks: [
      { 
        id: 301, 
        title: "Evaluasi Literasi Digital UMKM", 
        exams: [
          { id: 31, type: 'First Attempt', questions: umkmExamQuestions },
          { id: 32, type: 'Retake', questions: umkmExamQuestions }
        ]
      }
    ]
  }
];