import React from "react";
import {
  getAllTestimonials,
  deleteTestimonial,
  setTestimonialApproval,
} from "@/actions/admin/testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return redirect("/");
  }

  const res = await getAllTestimonials();
  if (!res.success) {
    return <div className="p-6">Unauthorized</div>;
  }

  const testimonials = (res.testimonials || []) as Array<{
    id: string;
    name: string;
    quote: string;
    approved: boolean;
    location?: string | null;
    work?: string | null;
  }>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <Button asChild>
          <Link href="/admin/testimonials/new">Add Testimonial</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{t.name}</span>
                <Badge variant={t.approved ? "default" : "secondary"}>
                  {t.approved ? "Approved" : "Pending"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.work ? (
                <div className="text-sm text-muted-foreground">{t.work}</div>
              ) : null}
              {t.location ? (
                <div className="text-sm text-muted-foreground">
                  {t.location}
                </div>
              ) : null}
              <p className="text-sm">{t.quote}</p>
              <div className="flex gap-2">
                <form
                  action={async () => {
                    "use server";
                    await setTestimonialApproval(t.id, !t.approved);
                  }}
                >
                  <Button type="submit" variant="outline" size="sm">
                    {t.approved ? "Unapprove" : "Approve"}
                  </Button>
                </form>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/testimonials/${t.id}/edit`}>Edit</Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteTestimonial(t.id);
                  }}
                >
                  <Button type="submit" variant="destructive" size="sm">
                    Delete
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
