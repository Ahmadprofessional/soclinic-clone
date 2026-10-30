"use client";

import { useLayoutEffect } from "react";

// The Elementor/Hello CSS keys many rules off classes on <body> (page-id-N, elementor-kit-N …).
// Apply the original page's body classes while this page is mounted.
export default function PageShell({
  bodyClass,
  route,
  header,
  children,
}: {
  bodyClass: string;
  route: string;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    const prev = document.body.className;
    document.body.className = bodyClass;
    document.body.dataset.route = route;
    return () => {
      document.body.className = prev;
    };
  }, [bodyClass, route]);

  return (
    <>
      {header}
      <div data-route={route}>{children}</div>
    </>
  );
}
