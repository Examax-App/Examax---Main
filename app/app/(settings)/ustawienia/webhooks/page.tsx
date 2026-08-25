import { Webhook } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { UpsellPanel } from "@/components/ui/UpsellPanel";

/** The reference "Webhooks" page — one plan-gated card. */
export default function WebhooksPage() {
  return (
    <>
      <PageHeader title="Webhooki" help />
      <div className="flex-1 px-6 pb-16 pt-6">
        <div className="rounded-cards border border-ash bg-white">
          <UpsellPanel
            icon={Webhook}
            title="Webhooki"
            description={
              <>
                Otrzymuj żądania HTTP za każdym razem, gdy w Twoim profilu
                wydarzy się coś ważnego (np. ukończony arkusz).{" "}
                <a href="#" className="underline">
                  Dowiedz się więcej
                </a>
              </>
            }
            ctaLabel="Ulepsz do Premium"
          />
        </div>
      </div>
    </>
  );
}
