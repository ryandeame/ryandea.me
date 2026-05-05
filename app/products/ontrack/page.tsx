import type { Metadata } from "next";

import ProductDetailPage from "@/components/products/ProductDetailPage";
import { productDetailBySlug, productDetails } from "@/data/products";

export const metadata: Metadata = {
  title: "OnTrack | Ryan Deame Products",
  description:
    "OnTrack is a mobile fitness and nutrition tracker for calories, macros, workouts, and food cost awareness.",
};

export default function OnTrackProductPage() {
  return (
    <ProductDetailPage
      product={productDetailBySlug.ontrack}
      relatedProducts={productDetails.filter((product) => product.slug !== "ontrack")}
    />
  );
}
