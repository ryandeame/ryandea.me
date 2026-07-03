export const SHOP_CURRENCIES = ["USD", "ARS", "BRL", "PEN", "PYG"] as const;

export type ShopCurrency = (typeof SHOP_CURRENCIES)[number];

export const DEFAULT_SHOP_CURRENCY: ShopCurrency = "USD";
export const SHOP_CURRENCY_STORAGE_KEY = "ryandea-shop-preferred-currency";
export const SHOP_CURRENCY_CHANGE_EVENT = "ryandea:shop-currency-change";

export function normalizeShopCurrency(value: string | null | undefined): ShopCurrency {
  const normalizedValue = value?.toUpperCase();

  if (SHOP_CURRENCIES.includes(normalizedValue as ShopCurrency)) {
    return normalizedValue as ShopCurrency;
  }

  return DEFAULT_SHOP_CURRENCY;
}
