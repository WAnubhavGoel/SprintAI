import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprint AI — The fastest way to learn anything",
  description: "Upload a PDF and get AI-generated study notes and quizzes instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
