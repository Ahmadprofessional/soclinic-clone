import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import AboutUsContent from "@/content/about-us";

export const metadata: Metadata = { title: "About Us – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-130 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-130" route="/about-us" header={<SiteHeader />}>
      <AboutUsContent />
    </PageShell>
  );
}
