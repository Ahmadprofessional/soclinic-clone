import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeaderPost from "@/components/SiteHeaderPost";
import HowToBuildASmoothieToFightInflammationContent from "@/content/how-to-build-a-smoothie-to-fight-inflammation";

export const metadata: Metadata = { title: "How to build a smoothie to fight inflammation? – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular post-template-default single single-post postid-657 single-format-standard wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/how-to-build-a-smoothie-to-fight-inflammation" header={<SiteHeaderPost />}>
      <HowToBuildASmoothieToFightInflammationContent />
    </PageShell>
  );
}
