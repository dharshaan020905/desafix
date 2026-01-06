import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import SessionWarningWrapper from "@/components/SessionWarningWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DesaFix - Hostel Facility Management",
  description: "Streamlined complaint management for university hostels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <SessionWarningWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}