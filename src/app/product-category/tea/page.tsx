import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ProductCategoryTeaContent from "@/content/product-category__tea";

export const metadata: Metadata = { title: "Tea – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="archive tax-product_cat term-tea term-21 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce woocommerce-page woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/product-category/tea" header={<SiteHeader />}>
      <ProductCategoryTeaContent />
    </PageShell>
  );
}
