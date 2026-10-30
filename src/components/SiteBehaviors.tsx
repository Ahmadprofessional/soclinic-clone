"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Re-creates the small bits of Elementor Pro front-end JS the original header relies on:
// active menu item, hover/tap sub-menus, burger toggle and the slide-in mini cart.
export default function SiteBehaviors() {
  const pathname = usePathname();

  // Elementor's posts widget flags grids whose thumbnails use a fixed aspect ratio.
  useEffect(() => {
    document.querySelectorAll(".elementor-posts-container").forEach((c) => {
      if (c.querySelector(".elementor-post__thumbnail")) c.classList.add("elementor-has-item-ratio");
    });
  }, [pathname]);

  // Active nav item follows the route.
  useEffect(() => {
    const here = pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll<HTMLAnchorElement>(".elementor-location-header .elementor-nav-menu--main a.elementor-item").forEach((a) => {
      const path = new URL(a.href, location.origin).pathname.replace(/\/$/, "") || "/";
      const on = path === here;
      a.classList.toggle("elementor-item-active", on);
      a.parentElement?.classList.toggle("current-menu-item", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // close mobile menu / cart after navigating
    document.querySelectorAll(".elementor-menu-toggle.elementor-active").forEach((t) => {
      t.classList.remove("elementor-active");
      t.setAttribute("aria-expanded", "false");
    });
    document.querySelector(".elementor-widget-woocommerce-menu-cart")?.classList.remove("elementor-menu-cart--shown");
  }, [pathname]);

  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 1025px)").matches;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      // burger
      const burger = t.closest<HTMLElement>(".elementor-menu-toggle");
      if (burger) {
        const on = !burger.classList.contains("elementor-active");
        burger.classList.toggle("elementor-active", on);
        burger.setAttribute("aria-expanded", String(on));
        return;
      }

      // sub-menu arrow tap (touch / tablet)
      const arrow = t.closest<HTMLElement>(".elementor-nav-menu--dropdown .sub-arrow, .elementor-nav-menu--dropdown .has-submenu");
      if (arrow && !isDesktop()) {
        const li = arrow.closest("li");
        const sub = li?.querySelector<HTMLElement>(":scope > ul.sub-menu");
        if (sub) {
          e.preventDefault();
          const open = sub.style.display === "block";
          sub.style.display = open ? "none" : "block";
          arrow.closest("a")?.setAttribute("aria-expanded", String(!open));
        }
        return;
      }

      // mini cart open / close
      const widget = t.closest<HTMLElement>(".elementor-widget-woocommerce-menu-cart");
      if (t.closest(".elementor-menu-cart__toggle_button")) {
        e.preventDefault();
        widget?.classList.toggle("elementor-menu-cart--shown");
        return;
      }
      if (t.closest(".elementor-menu-cart__close-button") || t.classList.contains("elementor-menu-cart__container")) {
        document.querySelector(".elementor-widget-woocommerce-menu-cart")?.classList.remove("elementor-menu-cart--shown");
      }
    };

    // desktop hover sub-menus (SmartMenus behaviour)
    const over = (e: MouseEvent) => {
      if (!isDesktop()) return;
      const li = (e.target as HTMLElement).closest<HTMLElement>(".elementor-nav-menu--main li.menu-item-has-children");
      const sub = li?.querySelector<HTMLElement>(":scope > ul.sub-menu");
      if (sub) {
        sub.style.display = "block";
        li?.classList.add("highlighted");
      }
    };
    const out = (e: MouseEvent) => {
      if (!isDesktop()) return;
      const li = (e.target as HTMLElement).closest<HTMLElement>(".elementor-nav-menu--main li.menu-item-has-children");
      if (!li || li.contains(e.relatedTarget as Node)) return;
      const sub = li.querySelector<HTMLElement>(":scope > ul.sub-menu");
      if (sub) sub.style.display = "";
      li.classList.remove("highlighted");
    };

    // Elementor's "stretch" nav: the mobile dropdown spans the full viewport width.
    const stretch = () => {
      document.querySelectorAll<HTMLElement>(".elementor-nav-menu--stretch .elementor-nav-menu__container.elementor-nav-menu--dropdown").forEach((dd) => {
        const anchor = dd.closest<HTMLElement>(".elementor-widget-container") ?? dd.parentElement;
        if (!anchor) return;
        dd.style.width = document.documentElement.clientWidth + "px";
        dd.style.left = -anchor.getBoundingClientRect().left + "px";
      });
    };
    stretch();
    window.addEventListener("resize", stretch);
    const stretchOnToggle = () => requestAnimationFrame(stretch);
    document.addEventListener("click", stretchOnToggle);

    document.addEventListener("click", onClick);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("resize", stretch);
      document.removeEventListener("click", stretchOnToggle);
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return null;
}
