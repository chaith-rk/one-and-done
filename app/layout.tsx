import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "One and Done",
  description: "Simple, powerful task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
