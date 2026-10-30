import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import CartContent from "@/content/cart";

export const metadata: Metadata = { title: "Cart – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-652 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-cart woocommerce-page woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/cart" header={<SiteHeader />}>
      <CartContent />
    </PageShell>
  );
}
