import { Suspense } from "react";

import ClayCheckoutSuccessPage from "@/components/claymation/ClayCheckoutSuccessPage";

export const metadata = {
  title: "Checkout Success | ryandea.me",
  description: "Your software purchase is confirmed.",
};

export default function CartSuccessRoutePage() {
  return (
    <Suspense fallback={null}>
      <ClayCheckoutSuccessPage />
    </Suspense>
  );
}
