import type { Metadata } from "next";

import ProductDetailPage from "@/components/products/ProductDetailPage";
import { productDetailBySlug, productDetails } from "@/data/products";

export const metadata: Metadata = {
  title: "Reach | Ryan Deame Products",
  description:
    "Reach is a personal CRM and outbound workflow app for outreach, job applications, social posting, and daily momentum.",
};

export default function ReachProductPage() {
  return (
    <ProductDetailPage
      product={productDetailBySlug.reach}
      relatedProducts={productDetails.filter((product) => product.slug !== "reach")}
    />
  );
}
