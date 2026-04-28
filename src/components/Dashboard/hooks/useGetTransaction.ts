// hooks/useGetTransactionByEmail.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/axios";
import ResponseStatsDashboard, {
  TransactionResponseDetail,
} from "../types/transactions";

export interface GetTransactionResponsesDashboard extends ResponseStatsDashboard {}

export function useGetTransactionByEmailDashboard() {
  return useQuery<GetTransactionResponsesDashboard>({
    queryKey: ["transactions-dashboard"],
    queryFn: async () => {
      const res = await api.get<ResponseStatsDashboard>(
        `/v1/transactions/email/dashboard`,
      );
      return res.data;
    },
  });
}
