"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  GetPaymentMethodResponse,
  PaymentMethod,
} from "../../types/PaymentMethod";
import Image from "next/image";

interface PaymentMethodProps {
  PaymentMethod: GetPaymentMethodResponse;
  activePayment: PaymentMethod | null;
  setSelectedPayment: (pay: PaymentMethod) => void;
  paymentError: string;
}

export default function PaymentMethodComponent({
  PaymentMethod,
  activePayment,
  setSelectedPayment,
  paymentError,
}: PaymentMethodProps) {
  return (
    <div className="relative">
      {/* Step Badge */}
      <div
        className="
     absolute -top-2 -left-2
      sm:-top-3 sm:-left-3
      w-7 h-7 sm:w-8 sm:h-8
      rounded-full
      flex items-center justify-center
      text-[11px] sm:text-xs font-bold
      bg-gradient-to-br from-purple-500 to-pink-500
      text-white
      shadow-md
      border-2 border-white dark:border-zinc-900
      z-10
    ">
        3
      </div>

      <div
        className="
      dark:bg-white/10
      bg-black/5
      backdrop-blur-lg
      rounded-3xl
      p-5 mb-6
      border border-white/20 dark:border-white/20
      shadow-xl
    ">
        {/* Header */}
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          Pilih Pembayaran
        </h2>

        {/* Payment Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {PaymentMethod?.data
            ?.flatMap((c) => c.payment_method ?? [])
            ?.map((payment) => {
              const isSelected = activePayment?.id === payment.id;

              return (
                <div
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className={`
              relative cursor-pointer rounded-2xl p-3
              transition-all duration-300
              flex flex-col items-center justify-between gap-2
              min-h-[100px] sm:min-h-[110px]
              ${
                isSelected
                  ? "bg-gradient-to-br from-blue-500 to-cyan-500 border border-white shadow-md scale-[1.02]"
                  : "bg-white/80 dark:bg-white/20 border border-gray-300 dark:border-white/30 hover:bg-white dark:hover:bg-white/30 hover:scale-[1.01]"
              }
            `}>
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`
                flex items-center justify-center
                h-12 w-12 rounded-xl transition-all
                ${isSelected ? "bg-white shadow-md" : "bg-transparent"}
              `}>
                    <Image
                      src={payment.icon_url}
                      alt={payment.name}
                      width={40}
                      height={40}
                      unoptimized={true}
                      className="object-contain"
                    />
                  </div>

                  {/* Name */}
                  <p className="text-gray-900 dark:text-white text-center text-xs font-medium leading-snug line-clamp-2">
                    {payment.full_name}
                  </p>
                </div>
              );
            })}
        </div>
        {paymentError && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{paymentError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
