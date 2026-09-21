declare module "swagger-ui-dist/swagger-ui-es-bundle.js" {
  export interface SwaggerUIBundleOptions {
    url?: string;
    spec?: object;
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
  }

  export interface SwaggerUIBundleInstance {
    destroy?: () => void;
  }

  declare function SwaggerUIBundle(
    options: SwaggerUIBundleOptions,
  ): SwaggerUIBundleInstance;

  export default SwaggerUIBundle;
}