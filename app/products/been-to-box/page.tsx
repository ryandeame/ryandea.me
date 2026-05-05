import type { Metadata } from "next";

import ProductDetailPage from "@/components/products/ProductDetailPage";
import { productDetailBySlug, productDetails } from "@/data/products";

export const metadata: Metadata = {
  title: "Been-To-Box | Ryan Deame Products",
  description:
    "Been-To-Box is an upcoming Expo app for personal travel stats, location highlights, and visual travel history.",
};

export default function BeenToBoxProductPage() {
  return (
    <ProductDetailPage
      product={productDetailBySlug["been-to-box"]}
      relatedProducts={productDetails.filter((product) => product.slug !== "been-to-box")}
    />
  );
}
