"use client";

import { useMutation } from "@tanstack/react-query";
import { CreateOrderRequest } from "../types/transaction";
import { api } from "../../../api/axios";
import { toast } from "sonner";
import { useRouter } from "../../../i18n/routing";
import { useTranslations } from "next-intl";

export function useCreateTransaction() {
  const router = useRouter();
  const t = useTranslations("GameCheckout");

  return useMutation({
    mutationFn: async (payload: CreateOrderRequest) => {
      console.log(
        "[createTransaction] payload:",
        JSON.stringify(payload, null, 2),
      );
      const res = await api.post("/v1/transactions", payload);
      return res.data;
    },
    onError: () => {
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
