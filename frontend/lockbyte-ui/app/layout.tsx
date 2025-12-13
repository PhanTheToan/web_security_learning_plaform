import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import ParticlesComponent from "@/components/particles-background";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CyberLock Academy",
  description: "CyberLock Academy Hack To Learn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <AuthProvider>
          <ParticlesComponent id="particles" />
          <div className="relative z-10">{children}</div>
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
