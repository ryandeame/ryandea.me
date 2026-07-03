"use client";

import { SHOP_CURRENCIES, type ShopCurrency } from "@/components/claymation/shopCurrency";
import { useShopCurrency } from "@/components/claymation/useShopCurrency";

type ClayCurrencySelectProps = {
  variant?: "nav" | "drawer";
};

export default function ClayCurrencySelect({ variant = "nav" }: ClayCurrencySelectProps) {
  const { currency, setCurrency } = useShopCurrency();
  const isDrawer = variant === "drawer";

  return (
    <label
      className={
        isDrawer
          ? "grid gap-2 rounded-2xl border border-[#161314]/10 bg-[#87e7ff]/35 p-4"
          : "hidden items-center rounded-full border border-[#161314]/15 bg-[#f6eec9] p-1 shadow-[0_8px_22px_rgba(43,34,24,0.08)] md:flex"
      }
    >
      <span
        className={
          isDrawer
            ? "text-xs font-black uppercase tracking-[0.18em] text-[#3f7f4b]"
            : "sr-only"
        }
      >
        Currency
      </span>
      <select
        aria-label="Preferred payment currency"
        className={
          isDrawer
            ? "h-12 rounded-full border-2 border-[#161314] bg-[#fff7d8] px-4 text-sm font-black text-[#161314] outline-none focus:ring-4 focus:ring-[#ffcf4d]/50"
            : "h-9 w-[72px] rounded-full border border-[#161314]/20 bg-[#fff7d8] px-2 text-[11px] font-black text-[#161314] outline-none focus:ring-4 focus:ring-[#ffcf4d]/50"
        }
        value={currency}
        onChange={(event) => setCurrency(event.target.value as ShopCurrency)}
      >
        {SHOP_CURRENCIES.map((currencyOption) => (
          <option key={currencyOption} value={currencyOption}>
            {currencyOption}
          </option>
        ))}
      </select>
    </label>
  );
}
