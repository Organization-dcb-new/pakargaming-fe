"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { GetGameResponse, Price } from "../../../types/Game";
import { formatPrice } from "../../../utils/format_price";
import { CategoryProductListResponse } from "../types/CategoryProduct";
import { useState } from "react";

interface ProductComponentProps {
  productGame: GetGameResponse;
  product: CategoryProductListResponse;
  activeProduct: Price | null;
  step?: number;
  setSelectedPackage: React.Dispatch<React.SetStateAction<Price | null>>;
}

export function ProductComponent({
  productGame,
  product,
  activeProduct,
  step = 2,
  setSelectedPackage,
}: ProductComponentProps) {
  const hasCategoryProduct = product?.data?.length > 0;

  const categorizedProductIds = new Set(
    (product?.data ?? []).flatMap((cat) => cat.product.map((p) => p.id)),
  );

  const remainingProducts =
    productGame?.data?.product?.filter(
      (p) => !categorizedProductIds.has(p.id),
    ) ?? [];

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const [showAllRemaining, setShowAllRemaining] = useState(false);

  const remainingLimit = 9;
  const hasManyRemaining = remainingProducts.length > remainingLimit;

  const displayedRemaining = showAllRemaining
    ? remainingProducts
    : remainingProducts.slice(0, remainingLimit);

  return (
    <div className="relative w-full sm:w-150">
      {/* Step Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md border-2 border-white dark:border-zinc-900 z-10">
        {step}
      </div>

      <div className="bg-black/5 dark:bg-white/10 rounded-3xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 shadow-xl">
        <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          Pilih Nominal Top Up
        </h2>

        {/* CATEGORY BUTTON */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hasCategoryProduct &&
            product.data.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(`category-${category.id}`)}
                className="
        px-3 py-1.5
        cursor-pointer
        rounded-full
        text-xs font-semibold
        bg-purple-200 text-purple-900
        hover:bg-purple-300
        dark:bg-purple-600 dark:text-white
        dark:hover:bg-purple-700
        transition
      "
              >
                {category.name}
              </button>
            ))}
        </div>

        {/* CATEGORY PRODUCT */}
        <div className="space-y-6">
          {hasCategoryProduct &&
            product.data.map((category) => (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="space-y-3 scroll-mt-28"
              >
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {category.name}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  {category.product.map((pkg) => {
                    const isSelected = activeProduct?.id === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`
                relative cursor-pointer rounded-xl p-2
                transition-all duration-300
                ${
                  isSelected
                    ? "border-2 border-purple-500 bg-white dark:bg-white/20 shadow-md scale-[1.02]"
                    : "border border-purple-500/30 bg-white/80 dark:bg-white/20 hover:border-purple-500 hover:bg-white dark:hover:bg-white/30 hover:scale-[1.01]"
                }
              `}>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1 shadow-md">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}

                        <p className="text-xs font-semibold text-gray-900 dark:text-white text-center mb-0.5">
                          {pkg.name.split("(").map((part, idx, arr) => (
                            <span key={idx}>
                              {idx > 0 ? "(" : ""}
                              {part}
                              {idx < arr.length - 1 && <br />}
                            </span>
                          ))}
                        </p>

                        <div className="flex items-center p-1 rounded">
                          <div className="flex-shrink-0 w-[50px] sm:w-[60px]">
                            <Image
                              src={
                                pkg.image ||
                                "https://s3.nevaobjects.id/image-dev/uploads/20260123164455.webp"
                              }
                              alt="img-product"
                              width={40}
                              height={40}
                              unoptimized={true}
                              className="object-contain"
                            />
                          </div>

                          <p className="flex-1 text-xs font-bold text-purple-600 dark:text-purple-400 text-center">
                            Rp {formatPrice(Math.round(pkg.selling_price))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* REMAINING PRODUCT */}
          {displayedRemaining.length > 0 && (
            <div className="space-y-3">
              {hasCategoryProduct && (
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Produk Lainnya
                </h3>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {displayedRemaining.map((pkg) => {
                  const isSelected = activeProduct?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`
                relative cursor-pointer rounded-xl p-2
                transition-all duration-300
                ${
                  isSelected
                    ? "border-2 border-purple-500 bg-white dark:bg-white/20 shadow-md scale-[1.02]"
                    : "border border-purple-500/30 bg-white/80 dark:bg-white/20 hover:border-purple-500 hover:bg-white dark:hover:bg-white/30 hover:scale-[1.01]"
                }
              `}>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1 shadow-md">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}

                      <p className="text-xs font-semibold text-gray-900 dark:text-white text-center mb-0.5">
                        {pkg.name}
                      </p>

                      <div className="flex items-center p-1 rounded">
                        <div className="flex-shrink-0 w-[50px] sm:w-[60px]">
                          <Image
                            src={
                              pkg.image ||
                              "https://s3.nevaobjects.id/image-dev/uploads/20260123164455.webp"
                            }
                            alt="img-product"
                            width={40}
                            height={40}
                            unoptimized={true}
                            className="object-contain"
                          />
                        </div>

                        <p className="flex-1 text-xs font-bold text-purple-600 dark:text-purple-400 text-center">
                          Rp {formatPrice(Math.round(pkg.selling_price))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {hasManyRemaining && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setShowAllRemaining(!showAllRemaining)}
                className="text-sm cursor-pointer font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                {showAllRemaining
                  ? "Tampilkan lebih sedikit"
                  : "Tampilkan produk lainnya"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
