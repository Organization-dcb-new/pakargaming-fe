"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CreateOrderRequest } from "@/features/game-topup/types/createOrder";
import { api } from "@/api/client";
import { TURNSTILE_HEADER } from "@/lib/session";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

/** Token Turnstile dari modal konfirmasi (null kalau Turnstile tidak dikonfigurasi). Dikirim via header. */
type CreateTransactionInput = CreateOrderRequest & { captchaToken?: string | null };

/** Jawaban proxy kalau token Turnstile tidak lolos (src/app/api/proxy/[...path]/route.ts). */
const CAPTCHA_FAILED_MESSAGE = "captcha verification failed";

type CreateTransactionOptions = {
  /**
   * Checkout dibalas 503 (stop transaksi, maintenance, cek ID tidak tersedia). Dipakai halaman top-up
   * untuk cek ulang status stop transaksi, supaya pemberitahuannya langsung muncul.
   */
  onUnavailable?: () => void;
};

export function useCreateTransaction({ onUnavailable }: CreateTransactionOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("GameCheckout");

  return useMutation({
    mutationFn: async ({ captchaToken, ...payload }: CreateTransactionInput) => {
      const res = await api.post("/v1/transactions", payload, {
        headers: captchaToken ? { [TURNSTILE_HEADER]: captchaToken } : undefined,
      });
      return res.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const message: unknown = error.response?.data?.message;

        if (status === 403) {
          toast.error(message === CAPTCHA_FAILED_MESSAGE ? t("toastCaptchaFailed") : t("toastCreateFailed"));
          return;
        }
        // 409 = harga berubah (backend sudah memperbarui produk) atau pesanan sama sedang diproses:
        // muat ulang daftar produk supaya harga yang tampil sama dengan yang akan ditagih.
        if (status === 409) {
          void queryClient.invalidateQueries({ queryKey: ["get-games-slug"] });
          void queryClient.invalidateQueries({ queryKey: ["categories-product"] });
        }
        if (status === 503) onUnavailable?.();
        // Pesan 4xx dan 503 (stop transaksi, maintenance, cek ID tidak tersedia) dari backend ditulis untuk pembeli.
        if (typeof message === "string" && message && ((status >= 400 && status < 500) || status === 503)) {
          toast.error(message);
          return;
        }
      }
      toast.error(t("toastCreateFailed"));
    },
    onSuccess: async (data) => {
      const trxId =
        data?.data?.id || data?.data?.transaction_id || data?.data?.uuid;

      if (!trxId) {
        toast.error(t("toastIdNotFound"));
        return;
      }

      toast.success(t("toastSuccessRedirecting"));

      await new Promise((res) => setTimeout(res, 800));

      router.replace(`/detail-trx/${trxId}`);
    },
  });
}
