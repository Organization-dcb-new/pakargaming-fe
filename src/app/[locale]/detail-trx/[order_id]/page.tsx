"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import DetailTrx from "../../../../components/DetailTrx/DetailTrx";
import DetailTrxSkeleton from "../../../../components/DetailTrx/components/DetailTrxSkeleton";
import { useGetTransaction } from "../../../../hooks/useTransaction";
import { TransactionNotFound } from "../../../../components/Transaction/TransactionNotFound";

export default function DetailTransactionPage() {
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
    return <DetailTrxSkeleton />;
  }

  if (!dataTrx) {
    return <TransactionNotFound onRetry={() => refetch()} />;
  }

  return <DetailTrx data={dataTrx} />;
}
