import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow">
          Back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MILCO — Made In Lesotho Cooperative" },
      { name: "description", content: "Shop authentic Made-in-Lesotho products: honey, peanut butter, skincare, crafts and more. Supporting local Basotho artisans." },
      { name: "keywords", content: "Lesotho, MILCO, Made in Lesotho, Basotho crafts, honey, peanut butter, NUL Innovation Hub" },
      { name: "author", content: "MILCO" },
      { property: "og:title", content: "MILCO — Made In Lesotho Cooperative" },
      { property: "og:description", content: "Shop authentic Made-in-Lesotho products: honey, peanut butter, skincare, crafts and more. Supporting local Basotho artisans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MILCO — Made In Lesotho Cooperative" },
      { name: "twitter:description", content: "Shop authentic Made-in-Lesotho products: honey, peanut butter, skincare, crafts and more. Supporting local Basotho artisans." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fa353002-fcad-488a-aaf9-7ee4bfb29542/id-preview-3f08c159--a9e95981-3b38-4c5d-ae12-b3e02c4f6a2c.lovable.app-1777403035910.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fa353002-fcad-488a-aaf9-7ee4bfb29542/id-preview-3f08c159--a9e95981-3b38-4c5d-ae12-b3e02c4f6a2c.lovable.app-1777403035910.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster richColors position="top-right" />
    </div>
  );
}
