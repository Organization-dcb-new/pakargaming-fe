export default function TermAndConditionPages() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8 space-y-6 text-gray-800 dark:text-gray-200 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Syarat dan Ketentuan Penggunaan PakarGaming
      </h1>

      <Section title="1. Ketentuan Umum">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Dengan mengakses atau menggunakan layanan PakarGaming, pengguna
            dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan
            yang berlaku pada halaman ini.
          </li>
          <li>
            PakarGaming menyediakan layanan pembelian produk digital seperti
            top-up game, voucher game, dan layanan digital lainnya melalui
            website resmi.
          </li>
          <li>
            PakarGaming berhak melakukan perubahan terhadap isi Syarat &
            Ketentuan kapan saja sesuai kebutuhan operasional maupun peraturan
            yang berlaku.
          </li>
        </ul>
      </Section>

      <Section title="2. Pengertian Istilah">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>PakarGaming:</strong> Platform digital penyedia layanan
            pembelian produk game dan virtual.
          </li>
          <li>
            <strong>Pengguna:</strong> Individu yang mengakses atau melakukan
            transaksi di PakarGaming.
          </li>
          <li>
            <strong>Akun:</strong> Identitas terdaftar dalam sistem PakarGaming.
          </li>
          <li>
            <strong>Produk Digital:</strong> Barang virtual seperti top-up,
            voucher, mata uang game.
          </li>
          <li>
            <strong>Mitra / Partner:</strong> Pihak ketiga penyedia produk atau
            sistem pembayaran.
          </li>
        </ul>
      </Section>

      <Section title="3. Layanan PakarGaming">
        <p>
          PakarGaming menyediakan layanan transaksi pembelian produk digital
          yang diproses secara otomatis maupun manual sesuai sistem yang
          berlaku.
        </p>
      </Section>

      <Section title="4. Ketentuan Transaksi">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Pengguna wajib memastikan seluruh data transaksi telah diisi dengan
            benar.
          </li>
          <li>Kesalahan pengisian data menjadi tanggung jawab pengguna.</li>
          <li>
            Produk digital bersifat instan sehingga tidak dapat dibatalkan.
          </li>
          <li>Transaksi dianggap selesai setelah produk berhasil dikirim.</li>
        </ul>
      </Section>

      <Section title="5. Pembatalan dan Pengembalian Dana">
        <ul className="list-disc pl-6 space-y-2">
          <li>Pesanan yang telah diproses tidak dapat dibatalkan.</li>
          <li>
            Refund hanya berlaku jika produk gagal dikirim atau terjadi
            kesalahan sistem.
          </li>
          <li>Proses refund maksimal 3 x 24 jam setelah disetujui.</li>
        </ul>
      </Section>

      <Section title="6. Metode Pembayaran">
        <ul className="list-disc pl-6 space-y-2">
          <li>Transfer Bank</li>
          <li>Virtual Account</li>
          <li>Dompet Digital / E-Wallet</li>
          <li>QRIS</li>
          <li>Minimarket</li>
          <li>Kartu Debit/Kredit</li>
        </ul>
      </Section>

      <Section title="7. Kewajiban Pengguna">
        <ul className="list-disc pl-6 space-y-2">
          <li>Memberikan data yang benar dan valid</li>
          <li>Menjaga kerahasiaan akun</li>
          <li>Menggunakan layanan secara legal</li>
          <li>Mematuhi hukum Indonesia</li>
        </ul>
      </Section>

      <Section title="8. Larangan Penggunaan">
        <ul className="list-disc pl-6 space-y-2">
          <li>Menggunakan bot atau manipulasi sistem</li>
          <li>Menyebarkan konten ilegal</li>
          <li>Aktivitas perjudian</li>
          <li>Menyamar sebagai pihak lain</li>
        </ul>
      </Section>

      <Section title="9. Batasan Tanggung Jawab">
        <p>
          PakarGaming tidak bertanggung jawab atas kesalahan data pengguna,
          gangguan internet, atau transaksi di luar sistem resmi.
        </p>
      </Section>

      <Section title="10. Perlindungan Data">
        <p>
          Data pengguna digunakan untuk memproses transaksi, meningkatkan
          layanan, dan menjaga keamanan sistem sesuai Kebijakan Privasi.
        </p>
      </Section>

      <Section title="11. Program Promosi">
        <p>
          Promo dapat berubah sewaktu-waktu dan dapat dibatalkan jika terjadi
          penyalahgunaan.
        </p>
      </Section>

      <Section title="12. Hak Kekayaan Intelektual">
        <p>
          Seluruh konten website dilindungi hak cipta dan tidak boleh digunakan
          tanpa izin.
        </p>
      </Section>

      <Section title="13. Penghapusan Akun">
        <ul className="list-disc pl-6 space-y-2">
          <li>Riwayat transaksi tidak dapat dikembalikan</li>
          <li>Bonus/reward akan hangus</li>
          <li>Penghapusan bersifat permanen</li>
        </ul>
      </Section>

      <Section title="14. Hukum yang Berlaku">
        <p>Ketentuan mengikuti hukum Republik Indonesia.</p>
      </Section>

      <Section title="15. Perubahan Layanan">
        <p>
          PakarGaming berhak mengubah layanan tanpa pemberitahuan sebelumnya.
        </p>
      </Section>

      <Section title="16. Kontak PakarGaming">
        <div className="mt-4 space-y-2">
          <p>📧 Email: pakargaming1@gmail.com</p>
          <p>📱 WhatsApp: +62 8131 7937 08</p>
        </div>
      </Section>
    </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}
