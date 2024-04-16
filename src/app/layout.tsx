import type { Metadata } from "next";
import "./globals.css";
import {ClientWrapper} from "@/app/ClientWrapper";

export const metadata: Metadata = {
  title: "Nexly",
  description: "The ultimate safe & fast communications platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClientWrapper>
        <body className={"w-screen h-screen"}>{children}</body>
      </ClientWrapper>
    </html>
  );
}
