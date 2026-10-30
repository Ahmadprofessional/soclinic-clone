import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import ContactUsContent from "@/content/contact-us";

export const metadata: Metadata = { title: "Contact Us – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-304 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-template-full-width elementor-kit-6 elementor-page elementor-page-304" route="/contact-us" header={<SiteHeader />}>
      <ContactUsContent />
    </PageShell>
  );
}
