import { ServiceWorkerRegistration } from "@/components/shared/sw-register";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "BachatZone - Committee Management System",
    template: "%s | BachatZone",
  },
  description:
    "BachatZone is a modern committee savings management platform. Create, manage, and track your ROSCA/Chit Fund committees with ease.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
            {process.env.NODE_ENV === "production" && <ServiceWorkerRegistration />}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
