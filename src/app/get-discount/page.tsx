import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import GetDiscountContent from "@/content/get-discount";

export const metadata: Metadata = { title: "Get Discount – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-953 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-953" route="/get-discount" header={<SiteHeader />}>
      <GetDiscountContent />
    </PageShell>
  );
}
