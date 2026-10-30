import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import HomeContent from "@/content/home";

export const metadata: Metadata = { title: "SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="home wp-singular page-template page-template-elementor_header_footer page page-id-11 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-11" route="/" header={<SiteHeader />}>
      <HomeContent />
    </PageShell>
  );
}
