export const SHOP_CART_STORAGE_KEY = "ryandea-shop-cart";
export const SHOP_CART_CHANGE_EVENT = "ryandea:shop-cart-change";

export type ShopCartItem = {
  addedAt: string;
  priceId?: string | null;
  productId: string;
  quantity: number;
};

export type ShopCart = {
  items: ShopCartItem[];
  updatedAt: string;
  version: 1;
};

let cachedCart: ShopCart | null = null;
let cachedCartRaw: string | null = null;

export function createEmptyCart(): ShopCart {
  return {
    items: [],
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

export function normalizeCart(rawCart: unknown): ShopCart {
  if (!rawCart || typeof rawCart !== "object") {
    return createEmptyCart();
  }

  const cart = rawCart as Partial<ShopCart>;

  if (!Array.isArray(cart.items)) {
    return createEmptyCart();
  }

  return {
    items: cart.items
      .filter((item) => item && typeof item.productId === "string")
      .map((item) => ({
        addedAt: typeof item.addedAt === "string" ? item.addedAt : new Date().toISOString(),
        priceId: typeof item.priceId === "string" ? item.priceId : null,
        productId: item.productId,
        quantity: Math.max(1, Number(item.quantity) || 1),
      })),
    updatedAt: typeof cart.updatedAt === "string" ? cart.updatedAt : new Date().toISOString(),
    version: 1,
  };
}

export function getStoredCart() {
  if (typeof window === "undefined") {
    return cachedCart ?? createEmptyCart();
  }

  try {
    const storedCart = window.localStorage.getItem(SHOP_CART_STORAGE_KEY);

    if (!storedCart) {
      const emptyCart = createEmptyCart();
      saveStoredCart(emptyCart);
      return emptyCart;
    }

    if (cachedCart && cachedCartRaw === storedCart) {
      return cachedCart;
    }

    const cart = normalizeCart(JSON.parse(storedCart));
    cachedCart = cart;
    cachedCartRaw = storedCart;
    return cart;
  } catch {
    const emptyCart = createEmptyCart();
    saveStoredCart(emptyCart);
    return emptyCart;
  }
}

export function saveStoredCart(cart: ShopCart) {
  cachedCart = cart;
  cachedCartRaw = JSON.stringify(cart);

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SHOP_CART_STORAGE_KEY, cachedCartRaw);
}

export function notifyCartChanged(cart: ShopCart) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(SHOP_CART_CHANGE_EVENT, {
      detail: { cart },
    }),
  );
}

export function getCartItemCount(cart: ShopCart) {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

export function addProductToCart(productId: string, priceId?: string | null) {
  const cart = getStoredCart();
  const existingItem = cart.items.find(
    (item) => item.productId === productId && item.priceId === (priceId ?? null),
  );
  const nextCart: ShopCart = {
    ...cart,
    items: existingItem
      ? cart.items.map((item) =>
          item === existingItem ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [
          ...cart.items,
          {
            addedAt: new Date().toISOString(),
            priceId: priceId ?? null,
            productId,
            quantity: 1,
          },
        ],
    updatedAt: new Date().toISOString(),
  };

  saveStoredCart(nextCart);
  notifyCartChanged(nextCart);
  return nextCart;
}

export function removeProductFromCart(productId: string, priceId?: string | null) {
  const cart = getStoredCart();
  const nextCart: ShopCart = {
    ...cart,
    items: cart.items.filter(
      (item) => !(item.productId === productId && item.priceId === (priceId ?? null)),
    ),
    updatedAt: new Date().toISOString(),
  };

  saveStoredCart(nextCart);
  notifyCartChanged(nextCart);
  return nextCart;
}

export function updateProductQuantity(
  productId: string,
  priceId: string | null | undefined,
  quantity: number,
) {
  const cart = getStoredCart();
  const normalizedQuantity = Math.max(1, Math.floor(quantity));
  const nextCart: ShopCart = {
    ...cart,
    items: cart.items.map((item) =>
      item.productId === productId && item.priceId === (priceId ?? null)
        ? { ...item, quantity: normalizedQuantity }
        : item,
    ),
    updatedAt: new Date().toISOString(),
  };

  saveStoredCart(nextCart);
  notifyCartChanged(nextCart);
  return nextCart;
}
