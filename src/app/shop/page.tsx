import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ShopContent from "@/content/shop";

export const metadata: Metadata = { title: "Shop – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="archive post-type-archive post-type-archive-product wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-shop woocommerce woocommerce-page woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/shop" header={<SiteHeader />}>
      <ShopContent />
    </PageShell>
  );
}
