import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ProductSoSleepyTeaContent from "@/content/product__so-sleepy-tea";

export const metadata: Metadata = { title: "SO Sleepy Tea – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular product-template-default single single-product postid-669 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce woocommerce-page woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/product/so-sleepy-tea" header={<SiteHeader />}>
      <ProductSoSleepyTeaContent />
    </PageShell>
  );
}
