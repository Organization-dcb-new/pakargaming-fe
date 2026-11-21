import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { GetTransactionResponseWithDetailProduct } from "@/types/transaction";

/**
 * Detail transaksi. Tidak di-poll: pembeli menekan "Cek status pembayaran" (refetch), dan backend
 * menanyakan status pembayaran yang masih menunggu ke Paylabs saat data ini diambil.
 */
export function useGetTransaction(id: string) {
  const { data, isLoading, isFetching, refetch } = useQuery<GetTransactionResponseWithDetailProduct>({
    queryKey: ["get-transaction-detail", id],
    queryFn: async () => {
      const res = await api.get(`/v1/transactions/${encodeURIComponent(id)}`);
      return res.data;
    },
  });

  return { data, isLoading, isFetching, refetch };
}
