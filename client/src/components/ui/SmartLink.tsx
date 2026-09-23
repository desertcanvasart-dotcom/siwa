import type { ReactNode } from "react";
import { Link } from "wouter";

/**
 * Link for admin-editable URLs: internal paths use client-side routing,
 * anything absolute (https://, mailto:, tel:) is a plain anchor —
 * wouter's Link can't navigate off-site.
 */
export function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
