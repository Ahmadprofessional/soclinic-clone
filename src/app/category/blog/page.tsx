import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import CategoryBlogContent from "@/content/category__blog";

export const metadata: Metadata = { title: "Blog – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="archive category category-blog category-1 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/category/blog" header={<SiteHeader />}>
      <CategoryBlogContent />
    </PageShell>
  );
}
