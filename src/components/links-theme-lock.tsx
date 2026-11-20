"use client";

import { useEffect } from "react";

export default function LinksThemeLock() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("neo-brutalist", "one-dark-pro", "dark");

    return () => {
      const saved = localStorage.getItem("theme-mode");
      const neo = saved === "neo-brutalist";
      const one = saved === "one-dark-pro";
      root.classList.toggle("neo-brutalist", neo);
      root.classList.toggle("one-dark-pro", one);
      root.classList.toggle(
        "dark",
        neo ||
          one ||
          saved === "dark" ||
          (saved !== "light" &&
            matchMedia("(prefers-color-scheme: dark)").matches),
      );
    };
  }, []);

  return null;
}
