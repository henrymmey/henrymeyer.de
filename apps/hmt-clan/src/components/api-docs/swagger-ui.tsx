"use client";

import { useEffect, useRef } from "react";
import "swagger-ui-dist/swagger-ui.css";
import "./swagger-ui.css";

type SwaggerUIOptions = {
  url?: string;
  domNode: HTMLElement;
  layout?: string;
  docExpansion?: "full" | "list" | "none";
  filter?: boolean;
  tryItOutEnabled?: boolean;
  persistAuthorization?: boolean;
  displayRequestDuration?: boolean;
  deepLinking?: boolean;
  customCss?: string;
  [key: string]: unknown;
};

type SwaggerUIInstance = {
  destroy?: () => void;
};

const CUSTOM_CSS = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui { font-family: inherit; }
`;

export default function ApiDocsSwagger() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: SwaggerUIInstance | undefined;
    let cancelled = false;

    import("swagger-ui-dist/swagger-ui-es-bundle.js").then((mod) => {
      if (cancelled || !ref.current) return;

      const SwaggerUIBundle =
        mod.default ??
        (
          window as Window & {
            SwaggerUIBundle?: (options: SwaggerUIOptions) => SwaggerUIInstance;
          }
        ).SwaggerUIBundle;

      if (!SwaggerUIBundle) return;

      instance = SwaggerUIBundle({
        url: "/api/openapi.yaml",
        domNode: ref.current,
        docExpansion: "full",
        filter: true,
        tryItOutEnabled: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        deepLinking: true,
        customCss: CUSTOM_CSS,
      });
    });

    return () => {
      cancelled = true;
      if (typeof instance?.destroy === "function") {
        instance.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="hmt-api-docs overflow-hidden rounded-xl border border-black/40"
    />
  );
}