"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_SHOP_CURRENCY,
  SHOP_CURRENCY_CHANGE_EVENT,
  SHOP_CURRENCY_STORAGE_KEY,
  type ShopCurrency,
  normalizeShopCurrency,
} from "@/components/claymation/shopCurrency";

export function useShopCurrency() {
  const [currency, setCurrencyState] = useState<ShopCurrency>(DEFAULT_SHOP_CURRENCY);

  useEffect(() => {
    const syncStoredCurrency = () => {
      setCurrencyState(
        normalizeShopCurrency(window.localStorage.getItem(SHOP_CURRENCY_STORAGE_KEY)),
      );
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SHOP_CURRENCY_STORAGE_KEY) {
        syncStoredCurrency();
      }
    };

    const handleCurrencyChange = (event: Event) => {
      const currencyDetail = (event as CustomEvent<{ currency?: string }>).detail?.currency;
      setCurrencyState(normalizeShopCurrency(currencyDetail));
    };

    syncStoredCurrency();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(SHOP_CURRENCY_CHANGE_EVENT, handleCurrencyChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SHOP_CURRENCY_CHANGE_EVENT, handleCurrencyChange);
    };
  }, []);

  const setCurrency = (nextCurrency: ShopCurrency) => {
    const normalizedCurrency = normalizeShopCurrency(nextCurrency);

    window.localStorage.setItem(SHOP_CURRENCY_STORAGE_KEY, normalizedCurrency);
    setCurrencyState(normalizedCurrency);
    window.dispatchEvent(
      new CustomEvent(SHOP_CURRENCY_CHANGE_EVENT, {
        detail: { currency: normalizedCurrency },
      }),
    );
  };

  return { currency, setCurrency };
}
