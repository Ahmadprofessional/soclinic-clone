import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import PrivacyPolicyContent from "@/content/privacy-policy";

export const metadata: Metadata = { title: "Privacy Policy – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="privacy-policy wp-singular page-template-default page page-id-3 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/privacy-policy" header={<SiteHeader />}>
      <PrivacyPolicyContent />
    </PageShell>
  );
}
