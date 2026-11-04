"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { GetGameResponse, Price } from "../../../types/Game";
import { formatPrice } from "../../../utils/format_price";
import { CategoryProductListResponse } from "../types/CategoryProduct";
import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import StepCard from "./StepCard";

interface ProductComponentProps {
  productGame: GetGameResponse;
  product: CategoryProductListResponse;
  activeProduct: Price | null;
  step?: number;
  setSelectedPackage: React.Dispatch<React.SetStateAction<Price | null>>;
  isLocked?: boolean;
  onLockedAction?: () => void;
}

export function ProductComponent({
  productGame,
  product,
  activeProduct,
  step = 2,
  setSelectedPackage,
  isLocked = false,
  onLockedAction,
}: ProductComponentProps) {
  const t = useTranslations("GameCheckout");
  const visibleCategories = (product?.data ?? []).filter(
    (category) => category.product && category.product.length > 0,
  );
  const hasCategoryProduct = visibleCategories.length > 0;

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

  const handleSelect = (pkg: Price) => {
    if (isLocked) {
      onLockedAction?.();
      return;
    }
    setSelectedPackage(pkg);
  };

  return (
    <StepCard
      id="product-section"
      step={step}
      title={t("selectDenom")}
      locked={isLocked}
      lockedLabel={t("stepLocked")}
    >
      {/* CATEGORY BUTTON */}
      {hasCategoryProduct && (
        <div className="mb-4 flex flex-wrap gap-2">
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                if (isLocked) {
                  onLockedAction?.();
                  return;
                }
                scrollToCategory(`category-${category.id}`);
              }}
              className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {/* CATEGORY PRODUCT */}
        {hasCategoryProduct &&
          visibleCategories.map((category) => (
            <div
              key={category.id}
              id={`category-${category.id}`}
              className="scroll-mt-28 space-y-3"
            >
              <h3 className="font-display text-base font-semibold text-foreground">
                {category.name}
              </h3>
              <div className={PACKAGE_GRID}>
                {category.product.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    label={pkg.name.split("(").map((part, idx, arr) => (
                      <span key={idx}>
                        {idx > 0 ? "(" : ""}
                        {part}
                        {idx < arr.length - 1 && <br />}
                      </span>
                    ))}
                    selected={activeProduct?.id === pkg.id}
                    onSelect={() => handleSelect(pkg)}
                  />
                ))}
              </div>
            </div>
          ))}

        {/* REMAINING PRODUCT */}
        {displayedRemaining.length > 0 && (
          <div className="space-y-3">
            {hasCategoryProduct && (
              <h3 className="font-display text-base font-semibold text-foreground">
                {t("otherProducts")}
              </h3>
            )}
            <div className={PACKAGE_GRID}>
              {displayedRemaining.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  label={pkg.name}
                  selected={activeProduct?.id === pkg.id}
                  onSelect={() => handleSelect(pkg)}
                />
              ))}
            </div>
          </div>
        )}

        {hasManyRemaining && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setShowAllRemaining(!showAllRemaining);
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              {showAllRemaining ? t("showLess") : t("showMore")}
              <ChevronDown
                aria-hidden
                className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${showAllRemaining ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </div>
    </StepCard>
  );
}

const PACKAGE_GRID = "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3";

const FALLBACK_PACKAGE_IMAGE =
  "https://s3.nevaobjects.id/image-dev/uploads/20260123164455.webp";

interface PackageCardProps {
  pkg: Price;
  label: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

/** Kartu nominal: nama (font display) + ikon item + harga cyan; terpilih = border & tint primary. */
function PackageCard({ pkg, label, selected, onSelect }: PackageCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex min-h-[5.5rem] cursor-pointer flex-col gap-2 rounded-xl border-2 p-3 text-left transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-input-background hover:border-primary/60"
      }`}
    >
      {selected && (
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
        </span>
      )}

      <span className="font-display text-sm font-semibold leading-snug text-foreground">
        {label}
      </span>

      <span className="mt-auto flex items-center justify-between gap-2">
        <Image
          src={pkg.image || FALLBACK_PACKAGE_IMAGE}
          alt=""
          width={28}
          height={28}
          unoptimized={true}
          className="h-7 w-7 shrink-0 object-contain"
        />
        <span className="text-sm font-bold text-primary">
          Rp {formatPrice(Math.round(pkg.selling_price))}
        </span>
      </span>
    </button>
  );
}
