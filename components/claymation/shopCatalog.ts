import { type ShopCurrency } from "@/components/claymation/shopCurrency";

export const CATALOG_CACHE_KEY = "ryandea-shop-catalog-current";

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export type StripeCurrencyOption = {
  unitAmount?: number | null;
  unitAmountDecimal?: string | null;
};

export type StripePrice = {
  id: string;
  active: boolean;
  currency: string;
  currencyOptions?: Record<string, StripeCurrencyOption>;
  unitAmount?: number | null;
  unitAmountDecimal?: string | null;
};

export type ShopProduct = {
  active: boolean;
  defaultPriceId?: string | null;
  description?: string;
  id: string;
  metadata?: Record<string, string>;
  name: string;
  prices?: StripePrice[];
};

export type ShopCatalog = {
  productCount?: number;
  products?: ShopProduct[];
  sourceSyncedAt?: string;
};

export function getCachedCatalog() {
  try {
    const cachedValue = window.localStorage.getItem(CATALOG_CACHE_KEY);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue) as ShopCatalog;
  } catch {
    window.localStorage.removeItem(CATALOG_CACHE_KEY);
    return null;
  }
}

export function saveCachedCatalog(catalog: ShopCatalog, cachedCatalog: ShopCatalog | null) {
  if (cachedCatalog?.sourceSyncedAt === catalog.sourceSyncedAt) {
    return;
  }

  window.localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(catalog));
}

export function getDisplayableProducts(catalog: ShopCatalog) {
  return [...(catalog.products ?? [])]
    .filter((product) => product.active && product.metadata?.display_on_site !== "false")
    .sort((a, b) => Number(a.metadata?.sort_order ?? 999) - Number(b.metadata?.sort_order ?? 999));
}

export function getDisplayableProduct(catalog: ShopCatalog) {
  return getDisplayableProducts(catalog)[0] ?? null;
}

export function getDefaultPrice(product: ShopProduct) {
  return (
    product.prices?.find((price) => price.id === product.defaultPriceId && price.active) ??
    product.prices?.find((price) => price.active) ??
    null
  );
}

export function getStripeMinorAmount(price: StripePrice, currency: ShopCurrency) {
  const selectedCurrency = currency.toLowerCase();
  const currencyOption = price.currencyOptions?.[selectedCurrency];
  const unitAmount =
    currencyOption?.unitAmount ??
    (price.currency.toLowerCase() === selectedCurrency ? price.unitAmount : null);
  const unitAmountDecimal =
    currencyOption?.unitAmountDecimal ??
    (price.currency.toLowerCase() === selectedCurrency ? price.unitAmountDecimal : null);

  if (typeof unitAmount === "number") {
    return unitAmount;
  }

  if (unitAmountDecimal) {
    const decimalAmount = Number(unitAmountDecimal);
    return Number.isInteger(decimalAmount) ? decimalAmount : null;
  }

  return null;
}

export function getPriceDisplayAmount(price: StripePrice | null, currency: ShopCurrency) {
  if (!price) {
    return null;
  }

  const minorAmount = getStripeMinorAmount(price, currency);

  if (typeof minorAmount !== "number") {
    return null;
  }

  return ZERO_DECIMAL_CURRENCIES.has(currency) ? minorAmount : minorAmount / 100;
}

export function formatCurrencyAmount(amount: number, currency: ShopCurrency) {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount);
}

export function formatPrice(price: StripePrice | null, currency: ShopCurrency) {
  const displayAmount = getPriceDisplayAmount(price, currency);

  if (typeof displayAmount !== "number") {
    return null;
  }

  return formatCurrencyAmount(displayAmount, currency);
}

export function normalizeCatalog(rawCatalog: unknown): ShopCatalog | null {
  if (!rawCatalog || typeof rawCatalog !== "object") {
    return null;
  }

  const catalog = rawCatalog as ShopCatalog;

  if (!Array.isArray(catalog.products)) {
    return null;
  }

  return catalog;
}
