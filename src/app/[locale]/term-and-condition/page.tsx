import LegalDocument, { LegalSection } from '../../../components/Legal/LegalDocument'

const LAST_UPDATED = '1 Juli 2026'

const SECTIONS: LegalSection[] = [
  {
    title: 'Ketentuan Umum',
    blocks: [
      {
        kind: 'list',
        items: [
          'Dengan mengakses atau menggunakan layanan PakarGaming, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang berlaku pada halaman ini.',
          'PakarGaming menyediakan layanan pembelian produk digital seperti top-up game, voucher game, dan layanan digital lainnya melalui website resmi.',
          'PakarGaming berhak melakukan perubahan terhadap isi Syarat & Ketentuan kapan saja sesuai kebutuhan operasional maupun peraturan yang berlaku.',
        ],
      },
    ],
  },
  {
    title: 'Pengertian Istilah',
    blocks: [
      {
        kind: 'list',
        items: [
          { term: 'PakarGaming', desc: 'Platform digital penyedia layanan pembelian produk game dan virtual.' },
          { term: 'Pengguna', desc: 'Individu yang mengakses atau melakukan transaksi di PakarGaming.' },
          { term: 'Akun', desc: 'Identitas terdaftar dalam sistem PakarGaming.' },
          { term: 'Produk Digital', desc: 'Barang virtual seperti top-up, voucher, mata uang game.' },
          { term: 'Mitra / Partner', desc: 'Pihak ketiga penyedia produk atau sistem pembayaran.' },
        ],
      },
    ],
  },
  {
    title: 'Layanan PakarGaming',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming menyediakan layanan transaksi pembelian produk digital yang diproses secara otomatis maupun manual sesuai sistem yang berlaku.',
      },
    ],
  },
  {
    title: 'Ketentuan Transaksi',
    blocks: [
      {
        kind: 'list',
        items: [
          'Pengguna wajib memastikan seluruh data transaksi telah diisi dengan benar.',
          'Kesalahan pengisian data menjadi tanggung jawab pengguna.',
          'Produk digital bersifat instan sehingga tidak dapat dibatalkan.',
          'Transaksi dianggap selesai setelah produk berhasil dikirim.',
        ],
      },
    ],
  },
  {
    title: 'Pembatalan dan Pengembalian Dana',
    blocks: [
      {
        kind: 'list',
        items: [
          'Pesanan yang telah diproses tidak dapat dibatalkan.',
          'Refund hanya berlaku jika produk gagal dikirim atau terjadi kesalahan sistem.',
          'Proses refund maksimal 3 x 24 jam setelah disetujui.',
        ],
      },
    ],
  },
  {
    title: 'Metode Pembayaran',
    blocks: [
      {
        kind: 'chips',
        items: ['Transfer Bank', 'Virtual Account', 'Dompet Digital / E-Wallet', 'QRIS', 'Minimarket', 'Kartu Debit/Kredit'],
      },
    ],
  },
  {
    title: 'Kewajiban Pengguna',
    blocks: [
      {
        kind: 'list',
        items: [
          'Memberikan data yang benar dan valid.',
          'Menjaga kerahasiaan akun.',
          'Menggunakan layanan secara legal.',
          'Mematuhi hukum Indonesia.',
        ],
      },
    ],
  },
  {
    title: 'Larangan Penggunaan',
    blocks: [
      {
        kind: 'list',
        items: [
          'Menggunakan bot atau manipulasi sistem.',
          'Menyebarkan konten ilegal.',
          'Aktivitas perjudian.',
          'Menyamar sebagai pihak lain.',
        ],
      },
    ],
  },
  {
    title: 'Batasan Tanggung Jawab',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming tidak bertanggung jawab atas kesalahan data pengguna, gangguan internet, atau transaksi di luar sistem resmi.',
      },
    ],
  },
  {
    title: 'Perlindungan Data',
    blocks: [
      {
        kind: 'text',
        text: 'Data pengguna digunakan untuk memproses transaksi, meningkatkan layanan, dan menjaga keamanan sistem sesuai Kebijakan Privasi.',
      },
    ],
  },
  {
    title: 'Program Promosi',
    blocks: [
      {
        kind: 'text',
        text: 'Promo dapat berubah sewaktu-waktu dan dapat dibatalkan jika terjadi penyalahgunaan.',
      },
    ],
  },
  {
    title: 'Hak Kekayaan Intelektual',
    blocks: [
      {
        kind: 'text',
        text: 'Seluruh konten website dilindungi hak cipta dan tidak boleh digunakan tanpa izin.',
      },
    ],
  },
  {
    title: 'Penghapusan Akun',
    blocks: [
      {
        kind: 'list',
        items: [
          'Riwayat transaksi tidak dapat dikembalikan.',
          'Bonus/reward akan hangus.',
          'Penghapusan bersifat permanen.',
        ],
      },
    ],
  },
  {
    title: 'Hukum yang Berlaku',
    blocks: [{ kind: 'text', text: 'Ketentuan mengikuti hukum Republik Indonesia.' }],
  },
  {
    title: 'Perubahan Layanan',
    blocks: [
      {
        kind: 'text',
        text: 'PakarGaming berhak mengubah layanan tanpa pemberitahuan sebelumnya.',
      },
    ],
  },
]

export default function TermAndConditionPages() {
  return (
    <LegalDocument
      title="Syarat & Ketentuan"
      intro="Ketentuan penggunaan layanan PakarGaming. Dengan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  )
}
