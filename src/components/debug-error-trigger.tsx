"use client";

import { useEffect } from "react";

export function DebugErrorTrigger() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("")) {
      throw new Error("500 Internal Sever Error!");
    }
  }, []);

  return null;
}
