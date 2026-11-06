# UI/UX Rules — Pakar Gaming Frontend

Dokumen ini adalah **kontrak** untuk semua pekerjaan refactor UI/UX. Tujuannya: bikin tampilan **konsisten, aksesibel, dan mudah dirawat** — tanpa mengubah logika bisnis.

> Basis aturan ini = hasil audit UI/UX 2026 (68 file mengandung **1061** warna hardcoded, container width campur aduk, state loading/empty/error tidak konsisten, banyak string belum di-i18n). Setiap aturan di bawah menyelesaikan salah satu temuan itu.

---

## Cara Kerja dengan Claude (WAJIB di setiap prompt)

Setiap kali user memberi permintaan, **sebelum/di samping mengeksekusi**, Claude WAJIB:

1. **Kasih opsi.** Kalau ada lebih dari satu pendekatan (style, layout, teknik, urutan kerja), tawarkan 2–4 opsi konkret dengan trade-off singkat. Untuk pilihan visual, gunakan `AskUserQuestion` dengan **preview/mockup** supaya bisa dibandingkan. Beri rekomendasi (opsi terbaik ditaruh pertama), jangan cuma daftar netral.
2. **Ajukan pertanyaan klarifikasi** bila permintaan ambigu atau ada keputusan yang memang hak user (arah brand, warna, scope, prioritas). Jangan menebak diam-diam hal yang mengubah hasil secara besar. Tapi jangan bertanya untuk hal yang punya default jelas — putuskan, lalu sebutkan asumsinya.
3. **Beri saran improve + kritik jujur.** Jangan asal mengiyakan (no "yes-man"). Kalau ada cara yang lebih baik, pola yang lebih rapi, risiko, atau ide yang kurang tepat — sampaikan terus terang beserta alasannya, lalu usulkan alternatif. Kritik diarahkan ke solusi, bukan sekadar menolak.

Nada: ringkas, langsung, kolaboratif. Tetap patuh §0 (jangan sentuh logika backend).

---

## 0. Prinsip Utama (WAJIB)

1. **JANGAN sentuh logika backend.** Data fetching, hooks (`useGame`, `useTransaction`, dst), mutation, interceptor axios, proxy, enkripsi, WebSocket, routing param — **biarkan apa adanya**. Refactor hanya menyentuh **presentasi**: markup, className, styling, layout, state UI, komponen visual.
   - Boleh: ganti warna → token, pecah komponen, tambah skeleton/empty/error UI, tambah `aria-*`, disable tombol saat `isPending` (murni UI).
   - Tidak boleh: ubah `queryKey`, endpoint, bentuk payload, urutan pemanggilan hook, validasi yang dipakai backend.
2. **Token dulu, baru styling.** Dilarang menambah warna hardcoded baru (lihat §2).
3. **Setiap view yang ambil data wajib punya 3 state:** loading, empty, error (lihat §6).
4. **Tidak ada string UI hardcoded.** Semua teks yang dilihat user lewat `next-intl` (lihat §8).
5. **Mobile-first & aksesibel by default** (lihat §7).
6. **Reuse > rewrite.** Sebelum bikin styling baru, cek komponen shared di §5 dan `src/components/ui/*`.

---

## 1. Struktur & Penamaan

- Halaman di `src/app/[locale]/**` hanya **wrapper tipis** — semua UI di `src/components/<Fitur>/`.
- Satu komponen = satu tanggung jawab. Target < ~200 baris; kalau lebih, pecah ke sub-komponen.
- Sub-komponen fitur diletakkan di `src/components/<Fitur>/components/`, hook lokal di `.../hooks/`, tipe di `.../types/`.
- **Dead code dihapus, bukan dibiarkan.** (`GameDetail/*` dan `Transaction/Status.tsx` sudah teridentifikasi tak terpakai — hapus saat menyentuh area itu.)
- Referensi file di PR/diskusi pakai path relatif, mis. `src/components/Home/Games.tsx:63`.

---

## 2. Warna — HANYA lewat token

**Aturan keras: dilarang memakai skala warna Tailwind mentah** (`purple-600`, `gray-900`, `slate-800`, `pink-500`, `green-500`, dst) untuk styling app. Gunakan **token semantik**.

### 2.1 Token yang tersedia (`src/styles/theme.css`)
`bg-background` `text-foreground` `bg-card` `text-card-foreground` `bg-popover` `bg-primary` `text-primary-foreground` `bg-secondary` `bg-muted` `text-muted-foreground` `bg-accent` `bg-destructive` `border-border` `bg-input` `ring-ring`.

### 2.2 Token yang HARUS ditambahkan (belum ada)
Tambahkan di `:root` dan `.dark` pada `src/styles/theme.css`, lalu daftarkan di blok `@theme inline`:

```css
/* Brand — nilai hue difinalisasi terpisah; default mengikuti aksen ungu/indigo yang sudah dipakai */
--brand:            <ungu/indigo>;      /* mis. #6d28d9 */
--brand-foreground: #ffffff;

/* Status semantik (dipakai badge transaksi, toast, dsb) — WAJIB punya varian light & dark */
--success: ...;   --success-foreground: ...;
--warning: ...;   --warning-foreground: ...;
--danger:  ...;   --danger-foreground:  ...;   /* pakai --destructive jika setara */
--info:    ...;   --info-foreground:    ...;
--pending: ...;   --pending-foreground: ...;
```

> **Brand final (redesign "Neon Arena", 2026-11):** warna diambil dari logo. Dark = default.
> - `--primary` = **cyan logo** (`#0bc1dc` di dark, teal `#0a7590` di light supaya lolos AA) → CTA, harga, link, fokus, state aktif.
> - `--brand` = **ungu logo** (`#8a35ac` di light, `#c98be6` di dark) → aksen sekunder: chip, tint, tag.
> - `--gradient-brand` (ungu → cyan) **hanya dekoratif** (garis, aksen) — jangan taruh teks di atasnya.
>
> **Bahasa visual (utility di `theme.css`):**
> - `chamfer` — sudut terpotong ala logo untuk CTA utama & tag. Atur ukuran: `chamfer [--chamfer:8px]`. Ring fokus otomatis aman (clip dilepas saat `:focus-visible`).
> - `shadow-glow` — glow cyan untuk hover kartu interaktif (pengganti `shadow-[...]` inline).
> - `font-display` — Chakra Petch untuk heading, wordmark, angka. Body tetap Plus Jakarta Sans.
> - `bg-stripes` — placeholder thumbnail game.
> - **Latar situs** = glow logo di `body` + `<GameBackdrop>` (item game melayang: diamond, koin, gamepad, potion, dsb; dipasang sekali di layout). Intensitas diatur token `--game-item-opacity`. **Jangan** kasih wrapper halaman background opaque (`bg-white`, `bg-gradient-to-br …`, `bg-background`) karena menutupi backdrop; cukup kartu/panel yang pakai `bg-card`.
> - Chip/filter aktif = inverse (`bg-foreground text-background`), bukan gradient.

### 2.3 Aturan pakai
| Kebutuhan | ✅ Pakai | ❌ Jangan |
|---|---|---|
| Aksi utama / brand | `bg-primary text-primary-foreground` | `bg-purple-600 text-white` |
| Teks utama | `text-foreground` | `text-gray-900 dark:text-white` |
| Teks sekunder | `text-muted-foreground` | `text-gray-500` |
| Garis/pemisah | `border-border` / `bg-border` | `border-gray-200 dark:border-gray-700` |
| Permukaan kartu | `bg-card` | `bg-white dark:bg-slate-900` |
| Status sukses/gagal/pending | token status (§2.2) via `<StatusBadge>` | `bg-green-100 text-green-700` |
| Fokus | `ring-ring` | `ring-purple-500` |

- **Opacity via token**: `bg-primary/10`, `border-border/60` — bukan `purple-500/20`.
- **Gradient brand**: definisikan sekali sebagai utility/CSS var (`--gradient-brand`), jangan tulis `from-purple-600 to-pink-600` berulang.
- Warna literal hanya boleh untuk hal yang memang bukan tema: logo brand pihak ketiga, overlay `black/50` di atas foto banner (itu OK karena selalu di atas media).

---

## 3. Layout, Spacing, Radius, Z-index

- **Container**: satu standar lebar konten. Bungkus halaman dengan wrapper konsisten (`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`). Jangan pakai `max-w-[980px]`, `max-w-[1030px]`, atau mencampur `6xl/5xl/7xl` antar bagian yang setara. Navbar & footer harus **sama lebar**.
- **Spacing**: pakai skala Tailwind standar (`2,3,4,6,8,12`). Hindari nilai satuan aneh (`pl-35`, `pl-71` — ini bahkan bukan kelas valid). Spacing besar wajib responsif: `space-y-12 md:space-y-24`, bukan `space-y-24` mati.
- **Radius**: pakai token radius. Konvensi:
  - Input & tombol kecil → `rounded-lg` (`--radius-md`)
  - Kartu/panel → `rounded-xl`
  - Modal/sheet besar → `rounded-2xl`
  - Pill/badge/avatar → `rounded-full`
  Jangan campur `rounded-3xl`/`2xl`/`xl` acak di elemen sejenis.
- **Shadow**: pakai `shadow-sm` (elemen), `shadow-lg`/`shadow-xl` (kartu menonjol/modal), `shadow-glow` (hover kartu interaktif). Jangan tulis `shadow-[0_0_8px_rgba(168,85,247,.5)]` inline.
- **Z-index** (patuhi tingkatan ini): konten `0` → sticky nav `40` → dropdown/popover `50` → sheet/drawer `100` → modal/dialog `110` → toast `120`. Jangan pakai `z-[60]` ad-hoc tanpa alasan.

---

## 4. Tipografi

- Font brand dimuat via `next/font` di `src/styles/fonts.ts` (Chakra Petch = `font-display`, Plus Jakarta Sans = body). `h1`–`h3` otomatis pakai font display. Jangan impor font ad-hoc per komponen.
- **Skala minimum**: teks yang dibaca user **≥ 12px** (`text-xs`). Dilarang `text-[11px]`/`text-[10px]` untuk konten (langgar WCAG 1.4.4). Label mikro pakai `text-xs` + `tracking-wide`.
- Hierarki heading via elemen semantik (`h1`→`h2`→`h3`), jangan lompat level demi ukuran. Ukuran diatur utility, bukan mengandalkan default `@layer base`.
- Teks panjang (halaman legal/about) dibatasi lebar baca: `max-w-prose` (~65 karakter). Jangan biarkan baris memanjang selebar `max-w-4xl`.
- Angka uang selalu lewat helper `formatPrice` ([src/utils/format_price.ts](src/utils/format_price.ts)) + komponen `<PriceText>` — konsisten prefix `Rp` dan pemisah ribuan.

---

## 5. Komponen Shared (bikin sekali, pakai di mana-mana)

Sebelum styling ulang, pakai/klarifikasi komponen ini. Yang belum ada → **buat di `src/components/ui/`** dan pakai konsisten:

| Komponen | Guna | Menggantikan |
|---|---|---|
| `<StatusBadge status="paid\|pending\|failed\|...">` | Badge status transaksi, warna dari token status | logika badge inline yang **terduplikasi di 3 file** (StatusTrx, PaymentDetail, my-transaction) |
| `<EmptyState icon title description action?>` | Tampilan "tidak ada data" | teks polos "Game not Available", "No transactions found" |
| `<ErrorState onRetry?>` | Tampilan error + tombol coba lagi | kotak merah ad-hoc, `Banner/Error.tsx` |
| `<Spinner size>` | Indikator loading konsisten | `border-2 animate-spin` DIY yang beda-beda warna |
| `<CopyButton value>` | Salin + toast + ikon centang sementara | handler copy tanpa feedback |
| `<FormField>` / `<FormError>` | Label + input + pesan error konsisten | asterisk `*` & `AlertCircle` yang ditulis ulang tiap form |
| `<PriceText value>` | Render uang | `.toLocaleString('id-ID')` tersebar |

- Skeleton harus **meniru layout final** (posisi & proporsi) untuk cegah CLS, dan jumlahnya sinkron dengan grid asli. Warna skeleton pakai `bg-muted`, bukan `bg-gray-200`.

---

## 6. State: Loading / Empty / Error (WAJIB untuk setiap data view)

Setiap komponen yang membaca data harus menangani **keempat kondisi**:

1. **Loading** → skeleton yang meniru layout (bukan spinner telanjang, bukan data palsu "…"). Tambah `aria-busy="true"` / `role="status"`.
2. **Empty** (sukses tapi kosong) → `<EmptyState>` dengan ikon + pesan + CTA bila relevan.
3. **Error** → `<ErrorState>` dengan pesan jelas + tombol retry (retry = panggil ulang `refetch` yang sudah ada, bukan logika baru).
4. **Success** → konten.

- Dilarang render **data placeholder palsu** saat loading (mis. tabel isi "…") — itu menyesatkan.
- Tombol submit/aksi: saat proses (`isPending`/`isLoading`) → `disabled` + tampilkan `<Spinner>` di dalamnya. (Murni UI, mencegah double-submit; tidak mengubah logika.)

---

## 7. Aksesibilitas (WCAG 2.1 AA sebagai target)

- **Fokus keyboard**: semua elemen interaktif punya `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`. Jangan hilangkan ring tanpa ganti.
- **Icon-only button** wajib `aria-label` (di-i18n).
- **Escape** menutup: dropdown search, menu profil, modal, sheet, lightbox QR.
- **Dialog/modal**: `role="dialog"` + `aria-modal="true"` + focus trap + kembalikan fokus ke pemicu saat tutup. (Pakai `Dialog`/`Sheet` dari `ui/` yang sudah handle ini.)
- **Status jangan hanya warna**: sertakan ikon + teks (mis. badge sukses = ikon centang + label, bukan sekadar hijau).
- **Gambar**: `alt` deskriptif (mis. nama game), bukan "image"/"Banner". Gambar dekoratif → `alt=""` + `aria-hidden`.
- **Motion**: hormati `prefers-reduced-motion` untuk animasi looping (`animate-ping`, `animate-floatSoft`, shine, carousel) → sediakan `motion-reduce:animate-none` / `motion-reduce:transition-none`.
- **Kontras**: teks minimal AA (4.5:1). Cek badge status di **dark mode** (banyak yang gagal sekarang).
- **Live region**: state loading/redirect (mis. `auth/callback`) pakai `role="status" aria-live="polite"`.
- **Landmark**: sidebar/nav pakai `<nav aria-label>`; halaman panjang sediakan skip-link ke konten utama.

---

## 8. Internationalization (next-intl)

- **Semua** teks yang dilihat user via `useTranslations(...)` + key di `src/messages/en.json` & `id.json`. Kedua file harus sinkron key-nya.
- Temuan yang wajib dipindah ke i18n: FAQ pembayaran (hardcoded ID), "Konfirmasi Pesanan", "Mengecek ID akun…", "Masukkan Data Akun", "Aman"/"Instan", "No transactions found", "Chat CS", contoh format PAY, dst.
- **Locale-aware**: format tanggal/angka mengikuti locale aktif, jangan pakai `'id-ID'` mati.
- Data konfigurasi (nomor CS, link sosial) → env/config, bukan hardcoded di komponen.

---

## 9. Form & Input

- Setiap field: label jelas, state error inline (pakai `<FormError>`), indikator wajib konsisten.
- Validasi beri **feedback saat blur/submit**, plus hint yang bisa ditindaklanjuti (mis. "Format nomor: 08xxxxxxxxxx").
- **State locked/disabled harus terlihat** (opacity + kursor + ikon gembok bila terkunci), bukan hanya `readOnly` yang tetap tampak bisa diedit.
- Skema validasi dan mutation **tidak diubah** — hanya presentasi feedback-nya.

---

## 10. Gambar & Media

- Pakai `next/image` dengan `width`/`height` atau `fill` + `sizes`. Hindari `unoptimized` kecuali benar-benar perlu (host di `next.config.ts` `images.remotePatterns`).
- Sediakan **fallback** saat gambar gagal/nul (placeholder + ikon), jangan kotak kosong.
- Domain gambar baru harus didaftarkan di `next.config.ts`. Jangan tarik aset UI dari URL pihak ketiga acak (mis. ikon Google dari `svgrepo.com`) — self-host.

---

## 11. Dark Mode

- Warnai lewat token — dark mode ikut otomatis. Jangan menambal `dark:bg-slate-800`, `dark:bg-black/40`, `dark:text-gray-300` ad-hoc.
- Rasio opacity konsisten antar mode (jangan `/30` di light tapi `/20` di dark untuk elemen sama).
- Permukaan (modal, popover, kartu) pakai `bg-card`/`bg-popover` — **jangan `bg-white` mati** (menyebabkan teks putih di atas putih di dark mode).
- Uji setiap layar di light **dan** dark sebelum selesai.

---

## 12. Motion & Animasi

- Durasi standar: `150–200ms` (mikro-interaksi UI), `300ms` (transisi normal), `500ms` (konten besar). Jangan campur acak.
- Semua transisi hover/active sertakan `transition-*` + `duration-*` eksplisit.
- Animasi looping wajib `motion-reduce:animate-none`.
- Hover jangan menyebabkan layout shift (pakai `transform`/`scale`, bukan mengubah ukuran box).

---

## 13. Quick Do / Don't

| ❌ Jangan | ✅ Lakukan |
|---|---|
| `bg-purple-600 text-gray-900` | `bg-primary text-foreground` |
| `dark:bg-slate-900` | `bg-card` |
| `text-[11px]` untuk konten | `text-xs` (≥12px) |
| `max-w-[980px]` | `max-w-7xl` (standar) |
| Spinner tanpa konteks / data palsu saat loading | Skeleton meniru layout |
| Teks status hanya warna | Ikon + label via `<StatusBadge>` |
| String "Konfirmasi Pesanan" di JSX | `t('confirmOrder')` |
| `<img src="https://svgrepo…">` | Aset self-host + `next/image` |
| Badge status inline di 3 file | `<StatusBadge>` |
| `ring-purple-500` | `ring-ring` |

---

## 14. Definition of Done (checklist per halaman)

Sebuah halaman dianggap **selesai di-refactor** jika:

- [ ] 0 warna Tailwind mentah (`grep -E '(purple|gray|slate|pink|green|red|indigo|zinc|emerald|amber|blue|cyan)-[0-9]'` bersih, kecuali overlay media yang diizinkan).
- [ ] Semua teks user lewat i18n (en + id sinkron).
- [ ] Ada state loading (skeleton), empty, dan error.
- [ ] Semua elemen interaktif punya `focus-visible` + `aria-label` (untuk icon button).
- [ ] Rapi di light & dark mode; kontras AA.
- [ ] Responsif dari 320px → desktop; tidak ada overflow horizontal tak sengaja; `safe-area` untuk bar fixed di mobile.
- [ ] Container width & radius sesuai standar §3.
- [ ] `prefers-reduced-motion` dihormati.
- [ ] **Tidak ada perubahan pada hook/endpoint/payload/logika** (diff hanya presentasi).
- [ ] `yarn build` lolos (walau `next.config.ts` meng-ignore error TS/eslint, kode tetap harus bersih).

---

_Living document — perbarui saat pola baru disepakati. Warna brand & bahasa visual: lihat catatan §2.2._
