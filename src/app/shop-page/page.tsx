import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ShopPageContent from "@/content/shop-page";

export const metadata: Metadata = { title: "Shop Page – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-681 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-681" route="/shop-page" header={<SiteHeader />}>
      <ShopPageContent />
    </PageShell>
  );
}
