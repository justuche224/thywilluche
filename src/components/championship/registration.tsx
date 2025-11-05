"use client";

import { User } from "better-auth";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Oswald } from "next/font/google";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fetchCountries, fetchStates, fetchCities } from "@/actions/location";
import {
  registerForChampionship,
  getChampionshipPaymentInfo,
} from "@/actions/championship";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface ExtendedUser extends User {
  username: string;
}

const formSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
});

const Registration = ({ user }: { user: ExtendedUser }) => {
  const router = useRouter();
  const [countries, setCountries] = useState<
    Array<{ id: number; name: string; iso2: string }>
  >([]);
  const [states, setStates] = useState<
    Array<{ id: number; name: string; iso2: string }>
  >([]);
  const [cities, setCities] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null
  );

  const { data: paymentInfo, isLoading: loadingPaymentInfo } = useQuery({
    queryKey: ["championship-payment-info"],
    queryFn: () => getChampionshipPaymentInfo(),
  });

  const paymentSettings = paymentInfo?.success ? paymentInfo.settings : null;
  const isPaymentConfigured = !!paymentSettings && !loadingPaymentInfo;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      state: "",
      country: "",
      city: "",
      address: "",
    },
  });

  const selectedCountry = form.watch("country");
  const selectedState = form.watch("state");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const result = await fetchCountries();
        if (result.success && result.data) {
          setCountries(result.data);
        } else {
          console.error("Error loading countries:", result.error);
        }
        setLoadingCountries(false);
      } catch (error) {
        console.error("Error loading countries:", error);
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      if (selectedCountry) {
        try {
          const result = await fetchStates(selectedCountry);
          if (result.success && result.data) {
            setStates(result.data);
            form.resetField("state");
            form.resetField("city");
          } else {
            console.error("Error loading states:", result.error);
            setStates([]);
          }
        } catch (error) {
          console.error("Error loading states:", error);
          setStates([]);
        }
      } else {
        setStates([]);
        setCities([]);
      }
    };
    loadStates();
  }, [selectedCountry, form]);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedCountry && selectedState) {
        try {
          const result = await fetchCities(selectedCountry, selectedState);
          if (result.success && result.data) {
            setCities(result.data);
            form.resetField("city");
          } else {
            console.error("Error loading cities:", result.error);
            setCities([]);
          }
        } catch (error) {
          console.error("Error loading cities:", error);
          setCities([]);
        }
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [selectedCountry, selectedState, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!isPaymentConfigured) {
      toast.error("Payment is currently unavailable. Please contact support.");
      return;
    }
    setFormData(values);
    setPaymentDialogOpen(true);
  };

  const handlePaymentMade = () => {
    setPaymentDialogOpen(false);
    setReceiptDialogOpen(true);
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile || !formData) {
      toast.error("Please select a receipt image");
      return;
    }

    setUploadingReceipt(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("images", receiptFile);
      uploadFormData.append("path", "championship-receipts");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const uploadResult = await response.json();
      const receiptUrl = uploadResult.imageUrls?.[0];

      if (!receiptUrl) {
        throw new Error("No receipt URL returned");
      }

      const finalData = {
        ...formData,
        receiptUrl,
      };

      const registrationResult = await registerForChampionship(finalData);

      if (!registrationResult.success) {
        throw new Error(registrationResult.message || "Registration failed");
      }

      toast.success(
        registrationResult.message || "Registration submitted successfully!"
      );
      setReceiptDialogOpen(false);
      form.reset();
      setFormData(null);
      setReceiptFile(null);
      router.refresh();
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload receipt"
      );
    } finally {
      setUploadingReceipt(false);
    }
  };

  return (
    <div className="min-h-screen space-y-10 my-10">
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className={`text-4xl lg:text-6xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              THYWILL&apos;S CHAMPION&apos;S LEAGUE
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 font-light mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              illo ex asperiores, vitae dolorem delectus minus deserunt error
              sapiente quod consequuntur! Numquam, quibusdam architecto sunt
              earum nisi sint ducimus aliquam? Dolor soluta eos, officiis
              repellat blanditiis ducimus cum incidunt
            </p>
          </motion.div>
        </div>
      </section>
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              User Information
            </h2>
            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={96}
                    height={96}
                    className="rounded-full object-cover w-24 h-24"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
                    {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.name ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.email ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.username ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="relative py-0 lg:py-0 mt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2
              className={`text-3xl lg:text-4xl font-bold text-[#800000] mb-6 ${oswald.className}`}
            >
              Additional Information
            </h2>
            <div className="bg-white/70 border border-gray-200 rounded-xl p-6 shadow-sm">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="p-6 md:p-8">
                    <FieldGroup>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="08012345678"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={loadingCountries}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.id}
                                    value={country.iso2}
                                  >
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedCountry || states.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem key={state.id} value={state.iso2}>
                                    {state.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={
                                !selectedCountry ||
                                !selectedState ||
                                cities.length === 0
                              }
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem key={city.id} value={city.name}>
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter your address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FieldGroup>
                    {!loadingPaymentInfo && !isPaymentConfigured && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Payment Unavailable</AlertTitle>
                        <AlertDescription>
                          Payment is currently unavailable. Please contact
                          support for assistance.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="mt-6 flex justify-end">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={!isPaymentConfigured || loadingPaymentInfo}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                  <FieldDescription className="px-6 text-center">
                    By clicking submit, you agree to our{" "}
                    <a href="#">Terms and Conditions</a>
                  </FieldDescription>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </section>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className={oswald.className}>
              Payment Instructions
            </DialogTitle>
            <DialogDescription>
              Please complete the payment using the details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {paymentSettings ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-lg">Payment Details</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Account Name:</span>{" "}
                    {paymentSettings.accountName}
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span>{" "}
                    {paymentSettings.accountNumber}
                  </p>
                  <p>
                    <span className="font-medium">Bank Name:</span>{" "}
                    {paymentSettings.bankName}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {paymentSettings.amount}
                  </p>
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Unavailable</AlertTitle>
                <AlertDescription>
                  Payment details are not configured. Please contact support.
                </AlertDescription>
              </Alert>
            )}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Payment Instructions</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Transfer the registration fee to the account above</li>
                <li>Take a screenshot or photo of your payment receipt</li>
                <li>
                  Click &quot;I&apos;ve made the payment&quot; button below
                </li>
                <li>Upload the receipt when prompted</li>
              </ol>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePaymentMade} disabled={!isPaymentConfigured}>
              I&apos;ve made the payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={oswald.className}>
              Upload Payment Receipt
            </DialogTitle>
            <DialogDescription>
              Please upload a screenshot or photo of your payment receipt
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Receipt Image (Screenshot/Photo)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleReceiptFileChange}
                disabled={uploadingReceipt}
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: JPG, PNG, GIF. Max size: 5MB
              </p>
              {receiptFile && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    Selected: {receiptFile.name}
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReceiptDialogOpen(false);
                setReceiptFile(null);
              }}
              disabled={uploadingReceipt}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReceiptUpload}
              disabled={!receiptFile || uploadingReceipt}
            >
              {uploadingReceipt ? "Uploading..." : "Submit Registration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Registration;
