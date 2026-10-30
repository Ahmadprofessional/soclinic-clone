import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import TestimonialsContent from "@/content/testimonials";

export const metadata: Metadata = { title: "Testimonials – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-466 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-466" route="/testimonials" header={<SiteHeader />}>
      <TestimonialsContent />
    </PageShell>
  );
}
