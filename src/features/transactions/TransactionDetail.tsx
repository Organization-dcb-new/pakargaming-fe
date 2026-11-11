"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import TransactionDetailView from "@/features/transactions/components/TransactionDetailView";
import TransactionDetailSkeleton from "@/features/transactions/components/TransactionDetailSkeleton";
import { useGetTransaction } from "@/features/transactions/api/useGetTransaction";
import { TransactionNotFound } from "@/features/transactions/components/TransactionNotFound";

/**
 * Detail transaksi: ambil data, lalu dengarkan WebSocket pembayaran supaya status
 * berubah otomatis (PENDING → PAID/FAILED) tanpa reload.
 */
export default function TransactionDetail() {
  const { order_id } = useParams<{ order_id: string }>();
  const { data: transaction, isLoading, refetch } = useGetTransaction(order_id);

  const dataTrx = transaction?.data;

  useEffect(() => {
    if (!dataTrx?.id) return;

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/api/ws/payment/${dataTrx.id}`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = () => {
      refetch();
    };

    socket.onerror = () => {};

    socket.onclose = () => {};
    return () => {
      socket.close();
    };
  }, [dataTrx?.id, refetch]);

  if (isLoading) {
    return <TransactionDetailSkeleton />;
  }

  if (!dataTrx) {
    return <TransactionNotFound onRetry={() => refetch()} />;
  }

  return <TransactionDetailView data={dataTrx} />;
}
