// hooks/useGetTransactionByEmail.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import ResponseStatsDashboard, {
  TransactionResponseDetail,
} from "@/types/dashboard";

export interface GetTransactionResponsesDashboard extends ResponseStatsDashboard {}

/** Sesi dikirim proxy dari cookie HttpOnly, jadi cukup tahu user sedang login atau tidak. */
export function useGetTransactionByEmailDashboard(isLoggedIn: boolean) {
  return useQuery<GetTransactionResponsesDashboard>({
    queryKey: ["transactions-dashboard"],
    queryFn: async () => {
      const res = await api.get<ResponseStatsDashboard>(
        `/v1/transactions/email/dashboard`,
      );
      return res.data;
    },
    enabled: isLoggedIn,
  });
}
