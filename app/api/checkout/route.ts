import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { SHOP_CURRENCIES, type ShopCurrency } from "@/components/claymation/shopCurrency";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  currency: z.enum(SHOP_CURRENCIES),
  items: z
    .array(
      z.object({
        displayedMinorAmount: z.number().int().min(0),
        priceId: z.string().min(1),
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(20),
});

type CheckoutItem = z.infer<typeof checkoutSchema>["items"][number];

function getSiteUrl(req: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const fallbackUrl = new URL(req.url).origin;

  try {
    return new URL(configuredUrl || fallbackUrl).origin;
  } catch {
    return fallbackUrl;
  }
}

function getCurrencyAmount(price: Stripe.Price, currency: ShopCurrency) {
  const selectedCurrency = currency.toLowerCase();
  const currencyOption = price.currency_options?.[selectedCurrency];
  const unitAmount =
    currencyOption?.unit_amount ??
    (price.currency === selectedCurrency ? price.unit_amount : null);
  const unitAmountDecimal =
    currencyOption?.unit_amount_decimal ??
    (price.currency === selectedCurrency ? price.unit_amount_decimal : null);

  if (typeof unitAmount === "number") {
    return { unit_amount: unitAmount };
  }

  if (unitAmountDecimal) {
    const decimalAmount = Number(unitAmountDecimal);

    if (Number.isInteger(decimalAmount)) {
      return { unit_amount: decimalAmount };
    }
  }

  return null;
}

function getProductId(product: string | Stripe.Product | Stripe.DeletedProduct) {
  return typeof product === "string" ? product : product.id;
}

async function buildLineItem(
  stripe: Stripe,
  item: CheckoutItem,
  currency: ShopCurrency,
): Promise<Stripe.Checkout.SessionCreateParams.LineItem> {
  const price = await stripe.prices.retrieve(item.priceId, {
    expand: ["currency_options", "product"],
  });
  const stripeProductId = getProductId(price.product);

  if (!price.active || stripeProductId !== item.productId) {
    throw new Error("Cart item is no longer available.");
  }

  if (typeof price.product !== "string" && "deleted" in price.product && price.product.deleted) {
    throw new Error("Cart item product is no longer available.");
  }

  const currencyAmount = getCurrencyAmount(price, currency);

  if (!currencyAmount) {
    throw new Error(`Cart item is not priced in ${currency}.`);
  }

  if (currencyAmount.unit_amount !== item.displayedMinorAmount) {
    throw new Error(
      "The product price changed. Refresh the cart and review the updated price before checkout.",
    );
  }

  return {
    price_data: {
      currency: currency.toLowerCase(),
      product: stripeProductId,
      ...currencyAmount,
    },
    quantity: item.quantity,
  };
}

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { ok: false, error: "Stripe is not configured." },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { currency, items } = checkoutSchema.parse(body);
    const stripe = new Stripe(stripeSecretKey);
    const siteUrl = getSiteUrl(req);
    const lineItems = await Promise.all(
      items.map((item) => buildLineItem(stripe, item, currency)),
    );

    const session = await stripe.checkout.sessions.create({
      adaptive_pricing: {
        enabled: false,
      },
      allow_promotion_codes: true,
      cancel_url: `${siteUrl}/cart`,
      line_items: lineItems,
      mode: "payment",
      success_url: `${siteUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    console.error("[checkout] failed to create session", error);

    const message =
      error instanceof z.ZodError
        ? "Please check your cart before checkout."
        : error instanceof Error
          ? error.message
          : "Unable to create checkout.";

    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
