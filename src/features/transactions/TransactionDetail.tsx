"use client";

import { useParams } from "next/navigation";
import TransactionDetailView from "@/features/transactions/components/TransactionDetailView";
import TransactionDetailSkeleton from "@/features/transactions/components/TransactionDetailSkeleton";
import { useGetTransaction } from "@/features/transactions/api/useGetTransaction";
import { TransactionNotFound } from "@/features/transactions/components/TransactionNotFound";

/**
 * Detail transaksi. Status tidak berubah sendiri: tombol "Cek status pembayaran" mengambil ulang
 * datanya, dan backend menanyakan pembayaran yang masih menunggu ke Paylabs.
 */
export default function TransactionDetail() {
  const { order_id } = useParams<{ order_id: string }>();
  const { data: transaction, isLoading, isFetching, refetch } = useGetTransaction(order_id);

  const dataTrx = transaction?.data;

  if (isLoading) {
    return <TransactionDetailSkeleton />;
  }

  if (!dataTrx) {
    return <TransactionNotFound onRetry={() => refetch()} />;
  }

  return <TransactionDetailView data={dataTrx} onCheckStatus={refetch} checkingStatus={isFetching} />;
}
