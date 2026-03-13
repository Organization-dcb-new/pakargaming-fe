import { useMutation } from "@tanstack/react-query";
import { CreateOrderRequest } from "../types/transaction";
import { api } from "../../../api/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateTransaction() {
  const router = useRouter();

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
      toast.error("Gagal membuat transaksi");
    },
    onSuccess: async (data) => {
      const trxId =
        data?.data?.id || data?.data?.transaction_id || data?.data?.uuid;

      if (!trxId) {
        toast.error("ID transaksi tidak ditemukan");
        return;
      }

      toast.success("Transaksi berhasil dibuat 🎉 Mengalihkan...");

      await new Promise((res) => setTimeout(res, 800));

      router.replace(`/en/detail-trx/${trxId}`);
    },
  });
}
