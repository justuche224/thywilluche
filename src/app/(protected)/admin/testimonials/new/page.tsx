import React from "react";
import { createTestimonial } from "@/actions/admin/testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/server-auth";

async function create(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const quote = formData.get("quote") as string;
  const location = (formData.get("location") as string) || null;
  const work = (formData.get("work") as string) || null;
  const rating = Number(formData.get("rating") || 5);
  const approved = formData.get("approved") === "on";

  await createTestimonial({ name, quote, location, work, rating, approved });
  redirect("/admin/testimonials");
}

const Page = async () => {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={create} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="work">Work (optional)</Label>
              <Input id="work" name="work" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input id="location" name="location" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min={1}
                max={5}
                defaultValue={5}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" name="quote" required rows={5} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="approved" name="approved" defaultChecked />
              <Label htmlFor="approved">Approved</Label>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
