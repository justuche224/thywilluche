import { ChampionshipRegistrationsList } from "@/components/admin/championship/championship-registrations-list";
import { PaymentSettingsButton } from "@/components/admin/championship/payment-settings-button";

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
        <PaymentSettingsButton />
      </div>
      <ChampionshipRegistrationsList />
    </div>
  );
}
