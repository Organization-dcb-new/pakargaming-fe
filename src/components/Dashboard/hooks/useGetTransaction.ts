// hooks/useGetTransactionByEmail.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import ResponseStatsDashboard, {
  TransactionResponseDetail,
} from "../types/transactions";

export interface GetTransactionResponsesDashboard extends ResponseStatsDashboard {}

export function useGetTransactionByEmailDashboard(token?: string | null) {
  return useQuery<GetTransactionResponsesDashboard>({
    queryKey: ["transactions-dashboard", token],
    queryFn: async () => {
      const res = await api.get<ResponseStatsDashboard>(
        `/v1/transactions/email/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    enabled: !!token,
  });
}
