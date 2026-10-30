import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SiteHeader from "@/components/SiteHeader";
import MyAccountContent from "@/content/my-account";

export const metadata: Metadata = { title: "My account – SO Clinic" };

export default function Page() {
  return (
    <PageShell bodyClass="wp-singular page-template-default page page-id-654 wp-embed-responsive wp-theme-hello-elementor theme-hello-elementor woocommerce-account woocommerce-page woocommerce-no-js hello-elementor-default elementor-default elementor-kit-6" route="/my-account" header={<SiteHeader />}>
      <MyAccountContent />
    </PageShell>
  );
}
