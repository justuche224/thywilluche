import React from "react";
import {
  getTestimonialById,
  updateTestimonial,
} from "@/actions/admin/testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { notFound, redirect } from "next/navigation";

type Props = { params: { id: string } };

async function update(id: string, formData: FormData) {
  "use server";
  const name = formData.get("name") as string | undefined;
  const quote = formData.get("quote") as string | undefined;
  const location = (formData.get("location") as string) || null;
  const work = (formData.get("work") as string) || null;
  const ratingValue = formData.get("rating");
  const rating = ratingValue ? Number(ratingValue) : undefined;
  const approved = formData.get("approved") === "on";

  await updateTestimonial(id, {
    name,
    quote,
    location,
    work,
    rating,
    approved,
  });
  redirect("/admin/testimonials");
}

const Page = async ({ params }: Props) => {
  const res = await getTestimonialById(params.id);
  if (!res.success || !res.testimonial) {
    notFound();
  }
  const t = res.testimonial;
  return (
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={update.bind(null, params.id)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={t.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="work">Work (optional)</Label>
              <Input id="work" name="work" defaultValue={t.work ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                name="location"
                defaultValue={t.location ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min={1}
                max={5}
                defaultValue={t.rating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea
                id="quote"
                name="quote"
                required
                rows={5}
                defaultValue={t.quote}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="approved"
                name="approved"
                defaultChecked={t.approved}
              />
              <Label htmlFor="approved">Approved</Label>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
