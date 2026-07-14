"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ClayNavbar from "@/components/claymation/ClayNavbar";
import { trackBeginCheckout } from "@/lib/analytics";
import {
  formatCurrencyAmount,
  formatPrice,
  getCachedCatalog,
  getDefaultPrice,
  getPriceDisplayAmount,
  getStripeMinorAmount,
  type StripePrice,
  type ShopCatalog,
  type ShopProduct,
} from "@/components/claymation/shopCatalog";
import {
  getStoredCart,
  removeProductFromCart,
  updateProductQuantity,
  type ShopCart,
  type ShopCartItem,
} from "@/components/claymation/shopCart";
import { useShopCurrency } from "@/components/claymation/useShopCurrency";

type ResolvedCartItem = {
  cartItem: ShopCartItem;
  lineTotal: number | null;
  minorAmount: number | null;
  priceLabel: string | null;
  price: StripePrice | null;
  product: ShopProduct | null;
};

function resolveCartItem(
  item: ShopCartItem,
  catalog: ShopCatalog | null,
  currency: ReturnType<typeof useShopCurrency>["currency"],
): ResolvedCartItem {
  const product = catalog?.products?.find((catalogProduct) => catalogProduct.id === item.productId) ?? null;
  const price =
    product?.prices?.find((productPrice) => productPrice.id === item.priceId && productPrice.active) ??
    (product ? getDefaultPrice(product) : null);
  const displayAmount = getPriceDisplayAmount(price, currency);
  const minorAmount = price ? getStripeMinorAmount(price, currency) : null;

  return {
    cartItem: item,
    lineTotal: typeof displayAmount === "number" ? displayAmount * item.quantity : null,
    minorAmount,
    priceLabel: formatPrice(price, currency),
    price,
    product,
  };
}

export default function ClayCartPage() {
  const { currency } = useShopCurrency();
  const [cart, setCart] = useState<ShopCart | null>(null);
  const [catalog, setCatalog] = useState<ShopCatalog | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [editingQuantityKey, setEditingQuantityKey] = useState<string | null>(null);
  const [removingItemKey, setRemovingItemKey] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState("");
  const [quantityDraft, setQuantityDraft] = useState("1");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setCart(getStoredCart());
      setCatalog(getCachedCatalog());
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const resolvedItems = useMemo(() => {
    return (cart?.items ?? []).map((item) => resolveCartItem(item, catalog, currency));
  }, [cart?.items, catalog, currency]);

  const cartTotal = resolvedItems.reduce((total, item) => total + (item.lineTotal ?? 0), 0);
  const hasUnpricedItems = resolvedItems.some(
    (item) => item.lineTotal === null || item.minorAmount === null,
  );
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const handleRemoveItem = (item: ShopCartItem) => {
    setCart(removeProductFromCart(item.productId, item.priceId));
    setRemovingItemKey(null);
  };

  const getItemKey = (item: ShopCartItem) => `${item.productId}-${item.priceId ?? "default"}`;

  const startQuantityEdit = (item: ShopCartItem) => {
    setEditingQuantityKey(getItemKey(item));
    setQuantityError("");
    setQuantityDraft(String(item.quantity));
  };

  const cancelQuantityEdit = () => {
    setEditingQuantityKey(null);
    setQuantityError("");
    setQuantityDraft("1");
  };

  const saveQuantityEdit = (item: ShopCartItem) => {
    if (!quantityDraft) {
      setQuantityError("A number needs to be there.");
      return;
    }

    const nextQuantity = Number(quantityDraft);

    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      setQuantityError("Use a positive whole number.");
      return;
    }

    setCart(updateProductQuantity(item.productId, item.priceId, nextQuantity));
    cancelQuantityEdit();
  };

  const handleQuantityDraftChange = (rawValue: string) => {
    const wholeNumberValue = rawValue.replace(/\D/g, "");
    setQuantityError("");
    setQuantityDraft(wholeNumberValue);
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0 || hasUnpricedItems) {
      return;
    }

    setCheckoutError("");
    setIsCheckingOut(true);
    trackBeginCheckout({
      currency,
      itemCount,
      items: resolvedItems.map((item) => ({
        itemName: item.product?.name,
        priceId: item.cartItem.priceId,
        productId: item.cartItem.productId,
        quantity: item.cartItem.quantity,
      })),
      value: cartTotal,
    });

    try {
      const response = await fetch("/api/checkout", {
        body: JSON.stringify({
          currency,
          items: resolvedItems.map((item) => ({
            displayedMinorAmount: item.minorAmount,
            priceId: item.cartItem.priceId,
            productId: item.cartItem.productId,
            quantity: item.cartItem.quantity,
          })),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to start checkout.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout.");
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6eec9] text-[#161314]">
      <ClayNavbar />
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden px-6 py-16 sm:min-h-[calc(100vh-94px)] sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(135,231,255,0.46),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(255,207,77,0.42),transparent_24%),radial-gradient(circle_at_54%_96%,rgba(141,203,150,0.32),transparent_36%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#3f7f4b]">
            Cart
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-serif text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl">
              Your software cart.
            </h1>
            <p className="rounded-full border border-[#161314]/15 bg-[#fff7d8]/80 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#2d6b3c]">
              {currency}
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] border-2 border-[#5c9958]/25 bg-[#fff7d8]/88 p-5 shadow-[0_24px_58px_rgba(43,34,24,0.14)] sm:p-7">
            {!cart ? (
              <p className="text-sm font-bold text-[#2b2218]/78">Loading cart.</p>
            ) : itemCount === 0 ? (
              <div className="py-12 text-center">
                <h2 className="font-serif text-4xl font-black tracking-tight">Your cart is empty.</h2>
                <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-[#2b2218]/78">
                  Add the single page website product from the shop and it will show up here.
                </p>
                <Link
                  href="/#shop"
                  className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#161314] bg-[#ffcf4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#161314] transition-transform hover:-translate-y-1 hover:bg-[#70d779]"
                >
                  Back to shop
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="grid gap-4">
                  {resolvedItems.map((item) => (
                    <article
                      key={getItemKey(item.cartItem)}
                      className="relative rounded-[1.5rem] border border-[#161314]/10 bg-[#f6eec9] p-5 shadow-[0_12px_30px_rgba(43,34,24,0.08)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3f7f4b]">
                            Software
                          </p>
                          <h2 className="mt-2 font-serif text-3xl font-black tracking-tight">
                            {item.product?.name ?? "Unavailable product"}
                          </h2>
                          {item.product?.description ? (
                            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#2b2218]/78">
                              {item.product.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-2xl font-black text-[#2d6b3c]">
                            {item.priceLabel ?? "Price unavailable"}
                          </p>
                          {editingQuantityKey === getItemKey(item.cartItem) ? (
                            <div className="mt-3 flex flex-wrap items-center gap-2 sm:justify-end">
                              <label
                                className="text-xs font-black uppercase tracking-[0.14em] text-[#2b2218]/60"
                                htmlFor={`quantity-${getItemKey(item.cartItem)}`}
                              >
                                Qty
                              </label>
                              <span className="sr-only">
                                Quantity for {item.product?.name ?? "cart item"}
                              </span>
                              <input
                                id={`quantity-${getItemKey(item.cartItem)}`}
                                className="h-10 w-20 rounded-xl border border-[#161314]/20 bg-white px-3 text-center text-sm font-black text-[#161314] outline-none focus:ring-4 focus:ring-[#ffcf4d]/50"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                type="text"
                                value={quantityDraft}
                                onChange={(event) => handleQuantityDraftChange(event.target.value)}
                              />
                              <button
                                type="button"
                                className="text-xs font-black uppercase tracking-[0.14em] text-[#2d6b3c]"
                                onClick={() => saveQuantityEdit(item.cartItem)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="text-xs font-black uppercase tracking-[0.14em] text-[#c2410c]"
                                onClick={cancelQuantityEdit}
                              >
                                Cancel
                              </button>
                              {quantityError ? (
                                <p className="basis-full text-xs font-bold text-[#c2410c] sm:text-right">
                                  {quantityError}
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <div className="mt-3 flex flex-wrap items-center gap-3 sm:justify-end">
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2b2218]/60">
                                Qty {item.cartItem.quantity}
                              </p>
                              <button
                                type="button"
                                className="text-xs font-black uppercase tracking-[0.14em] text-[#c2410c]"
                                onClick={() => startQuantityEdit(item.cartItem)}
                              >
                                Change
                              </button>
                            </div>
                          )}
                          {item.lineTotal !== null ? (
                            <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#2b2218]/60">
                              Line total {formatCurrencyAmount(item.lineTotal, currency)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="relative mt-5 inline-flex">
                        <button
                          type="button"
                          className="rounded-full bg-[#161314] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-[#fff7d8] transition-transform hover:-translate-y-0.5"
                          onClick={() => setRemovingItemKey(getItemKey(item.cartItem))}
                        >
                          Remove
                        </button>
                        {removingItemKey === getItemKey(item.cartItem) ? (
                          <div className="absolute bottom-full left-0 z-20 mb-3 w-64 rounded-2xl border-2 border-[#161314] bg-[#fff7d8] p-4 shadow-[0_16px_34px_rgba(43,34,24,0.2)]">
                            <p className="text-sm font-black leading-5 text-[#161314]">
                              Remove this item from your cart?
                            </p>
                            <div className="mt-4 flex gap-2">
                              <button
                                type="button"
                                className="rounded-full bg-[#c2410c] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white"
                                onClick={() => handleRemoveItem(item.cartItem)}
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-[#161314]/20 bg-[#f6eec9] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#161314]"
                                onClick={() => setRemovingItemKey(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>

                <aside className="h-fit rounded-[1.5rem] border-2 border-[#161314] bg-[#8dcb96] p-6 shadow-[0_16px_36px_rgba(43,34,24,0.14)]">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2b2218]/70">
                    Summary
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-4 border-b border-[#161314]/20 pb-4 text-sm font-black">
                    <span>Items</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <span className="text-sm font-black uppercase tracking-[0.14em]">Total</span>
                    <span className="min-w-0 break-words text-right text-xl font-black leading-tight sm:text-2xl">
                      {hasUnpricedItems ? "Unavailable" : formatCurrencyAmount(cartTotal, currency)}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isCheckingOut || hasUnpricedItems}
                    className="mt-7 w-full rounded-full border-2 border-[#161314] bg-[#fff7d8] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-[#161314] transition-transform hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    onClick={handleCheckout}
                  >
                    {isCheckingOut ? "Opening checkout" : "Checkout"}
                  </button>
                  {checkoutError ? (
                    <p className="mt-4 text-sm font-bold leading-5 text-[#c2410c]">
                      {checkoutError}
                    </p>
                  ) : null}
                </aside>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
