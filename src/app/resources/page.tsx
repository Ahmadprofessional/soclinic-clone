import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ResourcesContent from "@/content/resources";

export const metadata: Metadata = { title: "Resources – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-813 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-813" route="/resources" header={<SiteHeader />}>
      <ResourcesContent />
    </PageShell>
  );
}
