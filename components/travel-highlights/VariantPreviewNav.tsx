"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const variants = [
  { href: "/travel-highlights", label: "Cartographer" },
  { href: "/travel-highlights/space", label: "Space" },
  { href: "/travel-highlights/mountain", label: "Mountain" },
  { href: "/travel-highlights/city", label: "City" },
];

type VariantPreviewNavProps = {
  className?: string;
  chipClassName?: string;
  activeClassName?: string;
};

export default function VariantPreviewNav({
  className = "",
  chipClassName = "",
  activeClassName = "",
}: VariantPreviewNavProps) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      {variants.map((variant) => {
        const isActive = pathname === variant.href;

        return (
          <Link
            key={variant.href}
            href={variant.href}
            className={`${chipClassName} ${isActive ? activeClassName : ""}`.trim()}
          >
            {variant.label}
          </Link>
        );
      })}
    </div>
  );
}
