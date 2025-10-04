"use client";

import { updateContactInfoAction } from "@/actions/admin/contact-info";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

interface ContactInfoFormProps {
  data: Record<string, { value: string; label?: string }>;
}

export function ContactInfoForm({ data }: ContactInfoFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await updateContactInfoAction(formData);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={data.email?.value || ""}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={data.phone?.value || ""}
              placeholder="+1 (234) 567-8900"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={data.address?.value || ""}
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              name="facebook"
              type="url"
              defaultValue={data.facebook?.value || ""}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              name="instagram"
              type="url"
              defaultValue={data.instagram?.value || ""}
              placeholder="https://instagram.com/yourprofile"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="x">X (Twitter) URL</Label>
            <Input
              id="x"
              name="x"
              type="url"
              defaultValue={data.x?.value || ""}
              placeholder="https://x.com/yourhandle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              name="youtube"
              type="url"
              defaultValue={data.youtube?.value || ""}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Updating..." : "Update Contact Information"}
      </Button>
    </form>
  );
}
