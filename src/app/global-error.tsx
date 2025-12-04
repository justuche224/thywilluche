"use client";

import Pattern from "@/components/pattern";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Pattern />
        <div className="flex flex-col items-center text-center gap-5 justify-center min-h-screen w-full">
          <h2 className="text-3xl font-bold">Something went wrong!</h2>
          <h1 className="text-5xl font-bold">{error.message}</h1>
          <Button onClick={() => reset()}>Try again</Button>
          <p>
            Please contact{" "}
            <a href="mailto:support@thywilluche.com" className="text-primary">
              support@thywilluche.com
            </a>{" "}
            for support.
          </p>
        </div>
      </body>
    </html>
  );
}
