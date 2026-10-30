import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ProductsContent from "@/content/products";

export const metadata: Metadata = { title: "Products – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template page-template-elementor_header_footer page page-id-260 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-260" route="/products" header={<SiteHeader />}>
      <ProductsContent />
    </PageShell>
  );
}
