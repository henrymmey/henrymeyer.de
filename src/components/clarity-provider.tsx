"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export function ClarityProvider() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;
    if (!projectId) return;

    Clarity.init(projectId);
    Clarity.consentV2({
      ad_Storage: "denied",
      analytics_Storage: "denied",
    });
  }, []);

  return null;
}
