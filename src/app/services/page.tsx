import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ServicesContent from "@/content/services";

export const metadata: Metadata = { title: "Conditions We Support – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-167 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-167" route="/services" header={<SiteHeader />}>
      <ServicesContent />
    </PageShell>
  );
}
