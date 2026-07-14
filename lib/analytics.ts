import { logEvent } from "firebase/analytics";

import { initAnalytics } from "@/lib/firebase";

export const COOKIE_PREFERENCE_CHANGE_EVENT = "ryandea:cookie-preference-change";
export const COOKIE_PREFERENCE_STORAGE_KEY = "ryandea-cookie-preference";

type AnalyticsPrimitive = string | number | boolean | null | undefined;
type AnalyticsObject = Record<string, AnalyticsPrimitive>;
type AnalyticsParams = Record<
  string,
  AnalyticsPrimitive | AnalyticsObject | AnalyticsObject[]
>;

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(COOKIE_PREFERENCE_STORAGE_KEY) === "accepted";
}

export async function trackEvent(eventName: string, eventParams?: AnalyticsParams) {
  if (!hasAnalyticsConsent()) {
    return;
  }

  try {
    const analytics = await initAnalytics();

    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (error) {
    console.error(`[Analytics] Error logging event ${eventName}:`, error);
  }
}

type ShopItemEvent = {
  currency?: string;
  itemName?: string;
  location?: string;
  priceId?: string | null;
  productId: string;
  quantity?: number;
  value?: number | null;
};

export function trackShopItemClick(event: ShopItemEvent) {
  const item = {
    item_id: event.productId,
    item_name: event.itemName,
    item_list_name: event.location ?? "shop",
    price_id: event.priceId ?? undefined,
    quantity: event.quantity ?? 1,
  };

  trackEvent("select_item", {
    currency: event.currency,
    item_list_name: event.location ?? "shop",
    items: [item],
    value: event.value ?? undefined,
  });

  trackEvent("shop_item_click", {
    currency: event.currency,
    item_name: event.itemName,
    location: event.location ?? "shop",
    price_id: event.priceId ?? undefined,
    product_id: event.productId,
    quantity: event.quantity ?? 1,
    value: event.value ?? undefined,
  });
}

export function trackAddToCart(event: ShopItemEvent) {
  trackEvent("add_to_cart", {
    currency: event.currency,
    items: [
      {
        item_id: event.productId,
        item_name: event.itemName,
        price_id: event.priceId ?? undefined,
        quantity: event.quantity ?? 1,
      },
    ],
    value: event.value ?? undefined,
  });
}

export function trackBeginCheckout(event: {
  currency: string;
  itemCount: number;
  items: Array<{
    itemName?: string;
    priceId?: string | null;
    productId: string;
    quantity: number;
  }>;
  value: number;
}) {
  trackEvent("begin_checkout", {
    currency: event.currency,
    item_count: event.itemCount,
    items: event.items.map((item) => ({
      item_id: item.productId,
      item_name: item.itemName,
      price_id: item.priceId ?? undefined,
      quantity: item.quantity,
    })),
    value: event.value,
  });
}

export function trackPurchase(event: {
  currency?: string;
  itemCount?: number;
  transactionId?: string | null;
  value?: number | null;
}) {
  trackEvent("purchase", {
    currency: event.currency,
    item_count: event.itemCount,
    transaction_id: event.transactionId ?? undefined,
    value: event.value ?? undefined,
  });
}
