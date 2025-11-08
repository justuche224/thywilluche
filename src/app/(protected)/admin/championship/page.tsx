import { ChampionshipRegistrationsList } from "@/components/admin/championship/championship-registrations-list";
import { PaymentSettingsButton } from "@/components/admin/championship/payment-settings-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";

export default async function ChampionshipPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Championship Registrations</h1>
          <p className="text-muted-foreground">
            Manage your championship registrations
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link href="/admin/championship/reviews">
              <FileText className="mr-2 h-4 w-4" />
              View Reviews
            </Link>
          </Button>
          <PaymentSettingsButton />
        </div>
      </div>
      <ChampionshipRegistrationsList />
    </div>
  );
}
