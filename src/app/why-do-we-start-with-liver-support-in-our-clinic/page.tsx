import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeaderPost from "@/components/SiteHeaderPost";
import WhyDoWeStartWithLiverSupportInOurClinicContent from "@/content/why-do-we-start-with-liver-support-in-our-clinic";

export const metadata: Metadata = { title: "Why do we start with liver support in our clinic? – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular post-template-default single single-post postid-666 single-format-standard wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/why-do-we-start-with-liver-support-in-our-clinic" header={<SiteHeaderPost />}>
      <WhyDoWeStartWithLiverSupportInOurClinicContent />
    </PageShell>
  );
}
