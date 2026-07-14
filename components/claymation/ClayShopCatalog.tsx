"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { trackAddToCart, trackShopItemClick } from "@/lib/analytics";
import {
  CATALOG_CACHE_KEY,
  getCachedCatalog,
  getDefaultPrice,
  getPriceDisplayAmount,
  getDisplayableProducts,
  formatPrice,
  normalizeCatalog,
  saveCachedCatalog,
  type ShopProduct,
} from "@/components/claymation/shopCatalog";
import { addProductToCart } from "@/components/claymation/shopCart";
import { useShopCurrency } from "@/components/claymation/useShopCurrency";

type CatalogState =
  | { status: "loading" }
  | { status: "available"; products: ShopProduct[] }
  | { status: "unavailable" };

export default function ClayShopCatalog() {
  const { currency } = useShopCurrency();
  const router = useRouter();
  const [state, setState] = useState<CatalogState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    async function loadCatalog() {
      try {
        const cachedCatalog = getCachedCatalog();
        const catalogSnapshot = await getDoc(doc(db, "shopCatalog", "current"));

        if (!catalogSnapshot.exists()) {
          window.localStorage.removeItem(CATALOG_CACHE_KEY);
          if (!isCancelled) {
            setState({ status: "unavailable" });
          }
          return;
        }

        const catalog = normalizeCatalog(catalogSnapshot.data());

        if (!catalog) {
          window.localStorage.removeItem(CATALOG_CACHE_KEY);
          if (!isCancelled) {
            setState({ status: "unavailable" });
          }
          return;
        }

        saveCachedCatalog(catalog, cachedCatalog);

        const products = getDisplayableProducts(catalog);

        if (products.length === 0) {
          if (!isCancelled) {
            setState({ status: "unavailable" });
          }
          return;
        }

        if (!isCancelled) {
          setState({ status: "available", products });
        }
      } catch (error) {
        console.error("[shop] failed to load catalog", error);
        if (!isCancelled) {
          setState({ status: "unavailable" });
        }
      }
    }

    loadCatalog();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="mt-8 max-w-xl rounded-[2rem] border-2 border-[#5c9958]/30 bg-[#fff7d8]/86 p-6 text-left shadow-[0_20px_46px_rgba(43,34,24,0.14)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3f7f4b]">
          Loading Shop
        </p>
        <p className="mt-4 text-sm font-semibold leading-6 text-[#2b2218]/78">
          Checking the current product catalog.
        </p>
      </div>
    );
  }

  if (state.status === "unavailable") {
    return (
      <div className="mt-8 max-w-xl rounded-[2rem] border-2 border-[#c2410c]/25 bg-[#fff7d8]/86 p-6 text-left shadow-[0_20px_46px_rgba(43,34,24,0.14)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c2410c]">
          Shop Unavailable
        </p>
        <p className="mt-4 text-sm font-semibold leading-6 text-[#2b2218]/78">
          The product catalog is not available right now. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      {state.products.map((product) => {
        const selectedPrice = getDefaultPrice(product);
        const selectedPriceLabel = formatPrice(selectedPrice, currency);
        const selectedValue = getPriceDisplayAmount(selectedPrice, currency);

        return (
          <div
            key={product.id}
            className="w-full max-w-xl rounded-[2rem] border-2 border-[#5c9958]/30 bg-[#fff7d8]/86 p-6 text-left shadow-[0_20px_46px_rgba(43,34,24,0.14)]"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3f7f4b]">
              Offer
            </p>
            <div className="mt-3 flex flex-col gap-4">
              <h3 className="max-w-full font-serif text-3xl font-black leading-tight tracking-[-0.03em] text-[#161314] sm:text-4xl">
                {product.name}
              </h3>
              <p className="max-w-full text-2xl font-black leading-none text-[#2d6b3c] sm:text-3xl">
                {selectedPriceLabel || "Pricing Unavailable"}
              </p>
            </div>
            {product.description ? (
              <p className="mt-4 text-sm font-semibold leading-6 text-[#2b2218]/78">
                {product.description}
              </p>
            ) : null}
            {selectedPriceLabel ? (
              <button
                type="button"
                onClick={() => {
                  const eventPayload = {
                    currency,
                    itemName: product.name,
                    location: "home_shop_catalog",
                    priceId: selectedPrice?.id,
                    productId: product.id,
                    quantity: 1,
                    value: selectedValue,
                  };

                  trackShopItemClick(eventPayload);
                  trackAddToCart(eventPayload);
                  addProductToCart(product.id, selectedPrice?.id);
                  router.push("/cart");
                }}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#161314] bg-[#ffcf4d] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#161314] transition-transform hover:-translate-y-1 hover:bg-[#70d779]"
              >
                Add to cart
              </button>
            ) : (
              <div className="mt-6 rounded-xl bg-[#c2410c]/10 p-3 text-xs font-bold text-[#c2410c]">
                This product is not priced in {currency}. Choose another currency from the menu above.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
