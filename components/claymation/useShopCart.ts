"use client";

import { useSyncExternalStore } from "react";

import {
  SHOP_CART_CHANGE_EVENT,
  SHOP_CART_STORAGE_KEY,
  createEmptyCart,
  getCartItemCount,
  getStoredCart,
} from "@/components/claymation/shopCart";

const serverCartSnapshot = createEmptyCart();

function subscribeToCartChanges(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SHOP_CART_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SHOP_CART_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SHOP_CART_CHANGE_EVENT, onStoreChange);
  };
}

export function useShopCart() {
  const cart = useSyncExternalStore(
    subscribeToCartChanges,
    getStoredCart,
    () => serverCartSnapshot,
  );

  return {
    cart,
    itemCount: getCartItemCount(cart),
  };
}
