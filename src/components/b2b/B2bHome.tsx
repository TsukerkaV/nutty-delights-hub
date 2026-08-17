import { useState } from "react";
import { B2bHero } from "@/components/b2b/B2bHero";
import { BrandingTool } from "@/components/b2b/BrandingTool";
import { BulkPricing } from "@/components/b2b/BulkPricing";
import { OfficePlans } from "@/components/b2b/OfficePlans";
import { SmartInvoice } from "@/components/b2b/SmartInvoice";
import { type OfficePlanId } from "@/data/b2b-pricing";

export function B2bHome() {
  const [qty, setQty] = useState(50);
  const [planId, setPlanId] = useState<OfficePlanId | null>(null);

  return (
    <>
      <B2bHero />
      <BrandingTool />
      <BulkPricing qty={qty} onQty={setQty} />
      <OfficePlans
        onSubscribe={(id) => {
          setPlanId(id);
          document.getElementById("invoice")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <SmartInvoice qty={qty} planId={planId} />
    </>
  );
}
