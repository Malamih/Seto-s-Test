import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Thinkra منصة",
  description: "منصة تعليم عربية لإدارة التعلم والتدريب." 
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 px-6 pb-12 pt-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
