import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import OurTeamContent from "@/content/our-team";

export const metadata: Metadata = { title: "Our Team – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-764 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-764" route="/our-team" header={<SiteHeader />}>
      <OurTeamContent />
    </PageShell>
  );
}
