import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeaderPost from "@/components/SiteHeaderPost";
import TopTipsForGutHealthFromNutritionistsContent from "@/content/top-tips-for-gut-health-from-nutritionists";

export const metadata: Metadata = { title: "Top Tips for Gut Health from Nutritionists – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular post-template-default single single-post postid-661 single-format-standard wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/top-tips-for-gut-health-from-nutritionists" header={<SiteHeaderPost />}>
      <TopTipsForGutHealthFromNutritionistsContent />
    </PageShell>
  );
}
