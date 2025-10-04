import { getContactInfo } from "@/actions/admin/contact-info";
import { ContactInfoForm } from "@/components/admin/contact/contact-info-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = async () => {
  const contactInfo = await getContactInfo();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Contact Information</h1>
        <p className="text-muted-foreground">
          Manage your contact details and social media links
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Social Media</CardTitle>
          <CardDescription>
            Update your contact information and social media links. These will
            be displayed across your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactInfoForm data={contactInfo} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
