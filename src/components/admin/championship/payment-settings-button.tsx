"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentSettingsDialog } from "./payment-settings-dialog";
import { CreditCard } from "lucide-react";

export function PaymentSettingsButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <CreditCard className="w-4 h-4 mr-2" />
        Payment Settings
      </Button>
      <PaymentSettingsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
