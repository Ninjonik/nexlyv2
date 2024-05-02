import type { Metadata } from "next";
import "./globals.css";
import {ClientWrapper} from "@/app/ClientWrapper";
import {UserContextProvider} from "@/app/utils/UserContext";
import 'react-photo-view/dist/react-photo-view.css';

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
        <body className={"w-screen h-screen overflow-hidden"}>
            <UserContextProvider>
                <ClientWrapper>
                    {children}
                </ClientWrapper>
            </UserContextProvider>
        </body>
    </html>
  );
}
