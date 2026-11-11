/** Nomor bagian 2 digit untuk badge & daftar isi, mis. 3 → "03". Modul biasa (bukan 'use client') supaya bisa dipanggil di server. */
export const padNumber = (n: number) => String(n).padStart(2, '0')

/** Judul bagian → id anchor yang bisa dibagikan, mis. "Metode Pembayaran" → "metode-pembayaran" */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
