import { useTranslations } from 'next-intl'
import LegalDocument, { LegalSection } from '../../../components/Legal/LegalDocument'

/** ISO — diformat sesuai locale di LegalDocument */
const LAST_UPDATED = '2026-07-01'

const SECTIONS: LegalSection[] = [
  {
    title: 'Pendahuluan',
    blocks: [
      {
        kind: 'text',
        text: 'Kebijakan Privasi ini menjelaskan bagaimana PakarGaming mengumpulkan, menggunakan, menyimpan, melindungi, dan mengelola data pribadi pengguna platform PakarGaming.',
      },
      {
        kind: 'text',
        text: 'Dengan mengakses website, aplikasi, atau layanan PakarGaming, pengguna dianggap telah membaca, memahami, dan menyetujui kebijakan ini.',
      },
      {
        kind: 'text',
        text: 'Kebijakan ini berlaku untuk seluruh pengguna, baik yang memiliki akun maupun yang hanya mengakses layanan PakarGaming.',
      },
    ],
  },
  {
    title: 'Dasar Hukum',
    blocks: [
      {
        kind: 'list',
        items: [
          'Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.',
          'Peraturan terkait Sistem Elektronik dan Transaksi Elektronik.',
          'Peraturan hukum lain yang berlaku di Indonesia.',
        ],
      },
    ],
  },
  {
    title: 'Pengumpulan Data Pribadi',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming dapat mengumpulkan beberapa jenis informasi pengguna, termasuk namun tidak terbatas pada:',
      },
      {
        kind: 'subsection',
        heading: 'Informasi Identitas Pengguna',
        blocks: [
          {
            kind: 'list',
            items: [
              'Nama lengkap',
              'Username',
              'Email',
              'Nomor telepon',
              'Alamat atau lokasi',
              'Data identitas (jika diperlukan untuk verifikasi)',
            ],
          },
        ],
      },
      {
        kind: 'subsection',
        heading: 'Informasi Transaksi',
        blocks: [
          {
            kind: 'list',
            items: ['Riwayat pembelian', 'Data pembayaran', 'Informasi rekening atau metode pembayaran'],
          },
        ],
      },
      {
        kind: 'subsection',
        heading: 'Informasi Penggunaan Layanan',
        blocks: [
          {
            kind: 'list',
            items: [
              'Alamat IP',
              'Jenis perangkat dan browser',
              'Aktivitas pengguna dalam website',
              'Data log sistem',
              'Preferensi penggunaan layanan',
            ],
          },
        ],
      },
      {
        kind: 'subsection',
        heading: 'Informasi Tambahan',
        blocks: [
          {
            kind: 'text',
            text: 'PakarGaming dapat memperoleh data pengguna dari mitra pembayaran, vendor layanan, atau pihak ketiga lain yang bekerja sama secara resmi.',
          },
        ],
      },
    ],
  },
  {
    title: 'Tujuan Penggunaan Data',
    blocks: [
      {
        kind: 'list',
        items: [
          'Memproses transaksi pembelian produk digital.',
          'Verifikasi identitas pengguna.',
          'Mengelola akun pengguna.',
          'Memberikan layanan pelanggan.',
          'Mengembangkan dan meningkatkan layanan.',
          'Mengirim informasi promo dan penawaran.',
          'Mencegah penipuan dan penyalahgunaan sistem.',
          'Memenuhi kewajiban hukum.',
        ],
      },
    ],
  },
  {
    title: 'Pengungkapan Data Kepada Pihak Ketiga',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming dapat membagikan data pengguna kepada pihak ketiga yang bekerja sama, seperti:',
      },
      {
        kind: 'list',
        items: [
          'Penyedia layanan pembayaran',
          'Vendor sistem dan teknologi',
          'Partner produk digital',
          'Penyedia layanan keamanan dan analitik',
          'Otoritas pemerintah apabila diwajibkan oleh hukum',
        ],
      },
      {
        kind: 'text',
        text: 'PakarGaming memastikan pihak ketiga tersebut memiliki standar perlindungan data yang sesuai.',
      },
    ],
  },
  {
    title: 'Keamanan Data',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming menerapkan langkah teknis dan administratif untuk melindungi data pengguna, termasuk:',
      },
      {
        kind: 'list',
        items: ['Enkripsi data', 'Sistem keamanan server', 'Pembatasan akses data internal', 'Monitoring aktivitas sistem'],
      },
      {
        kind: 'text',
        text: 'Namun pengguna juga bertanggung jawab menjaga kerahasiaan akun, password, dan OTP.',
      },
    ],
  },
  {
    title: 'Penyimpanan Data',
    blocks: [
      { kind: 'text', text: 'Data pribadi pengguna akan disimpan selama:' },
      {
        kind: 'list',
        items: [
          'Masih diperlukan untuk operasional layanan.',
          'Diperlukan untuk kepentingan hukum.',
          'Diperlukan untuk penyelesaian transaksi.',
        ],
      },
      {
        kind: 'text',
        text: 'Setelah tidak diperlukan, data dapat dihapus atau dianonimkan sesuai ketentuan hukum.',
      },
    ],
  },
  {
    title: 'Hak Pengguna Atas Data Pribadi',
    blocks: [
      {
        kind: 'list',
        items: [
          'Mengakses data pribadi miliknya.',
          'Memperbaiki data yang tidak akurat.',
          'Meminta penghapusan data.',
          'Membatasi pemrosesan data.',
          'Menarik persetujuan penggunaan data.',
          'Mengajukan keluhan terkait penggunaan data.',
        ],
      },
      { kind: 'text', text: 'Permintaan dapat diajukan melalui kontak resmi PakarGaming.' },
    ],
  },
  {
    title: 'Penghapusan Data dan Akun',
    blocks: [
      { kind: 'text', text: 'Pengguna dapat mengajukan penghapusan akun dengan ketentuan:' },
      {
        kind: 'list',
        items: [
          'Data transaksi tertentu tetap dapat disimpan sesuai kewajiban hukum.',
          'Penghapusan akun bersifat permanen.',
          'Beberapa layanan mungkin tidak dapat digunakan setelah penghapusan akun.',
        ],
      },
    ],
  },
  {
    title: 'Penggunaan Cookies',
    blocks: [
      { kind: 'text', text: 'PakarGaming menggunakan cookies untuk:' },
      {
        kind: 'list',
        items: [
          'Menyimpan preferensi pengguna.',
          'Membantu proses login.',
          'Menganalisis penggunaan layanan.',
          'Menyediakan pengalaman pengguna yang lebih baik.',
        ],
      },
      {
        kind: 'text',
        text: 'Pengguna dapat menonaktifkan cookies melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi secara optimal.',
      },
    ],
  },
  {
    title: 'Tautan ke Situs Pihak Ketiga',
    blocks: [
      {
        kind: 'text',
        text: 'Website PakarGaming dapat berisi tautan ke layanan pihak ketiga. PakarGaming tidak bertanggung jawab atas kebijakan privasi situs tersebut.',
      },
    ],
  },
  {
    title: 'Batasan Tanggung Jawab',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming tidak bertanggung jawab atas kebocoran data yang disebabkan oleh:',
      },
      {
        kind: 'list',
        items: [
          'Kelalaian pengguna menjaga keamanan akun.',
          'Akses ilegal akibat kesalahan pengguna.',
          'Gangguan sistem di luar kendali PakarGaming.',
          'Keadaan force majeure seperti bencana alam atau gangguan jaringan besar.',
        ],
      },
    ],
  },
  {
    title: 'Hak Kekayaan Intelektual',
    blocks: [
      {
        kind: 'text',
        text: 'Seluruh konten dalam website PakarGaming dilindungi hukum dan tidak boleh digunakan tanpa izin.',
      },
    ],
  },
  {
    title: 'Perubahan Kebijakan',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming dapat memperbarui Kebijakan Privasi sewaktu-waktu. Perubahan akan ditampilkan pada halaman ini beserta tanggal pembaruan.',
      },
    ],
  },
]

export default function PolicyAndPrivacy() {
  const t = useTranslations('Legal')

  return (
    <LegalDocument
      title={t('privacyTitle')}
      intro={t('privacyIntro')}
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  )
}
