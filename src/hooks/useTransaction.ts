import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import {
  GetTransactionResponses,
  GetTransactionResponseWithDetailProduct,
} from "../types/Transaction";

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

/** Sesi dikirim proxy dari cookie HttpOnly, jadi cukup tahu user sedang login atau tidak. */
export function useGetTransactionByEmail(
  email?: string,
  page = 1,
  isLoggedIn = false,
) {
  return useQuery<GetTransactionResponses>({
    queryKey: ["transactions", email, page],
    queryFn: async () => {
      const res = await api.get("/v1/transactions/email", {
        params: {
          page,
          limit: 10,
        },
      });
      return res.data;
    },
    enabled: !!email && isLoggedIn,
  });
}
