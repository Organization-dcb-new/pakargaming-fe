import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { GetTransactionResponseWithDetailProduct } from "@/types/transaction";

export function useGetTransaction(id: string) {
  const { data, isLoading, refetch } = useQuery<GetTransactionResponseWithDetailProduct>(
    {
      queryKey: ["get-transaction-detail", id],
      queryFn: async () => {
        const res = await api.get(`/v1/transactions/${id}`);
        return res.data;
      },
      refetchIntervalInBackground: true,
    },
  );

  return { data, isLoading, refetch };
}
