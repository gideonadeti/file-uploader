import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import localFont from "next/font/local";

import "./globals.css";
import { H1, H3 } from "./components/custom-tags";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "./components/header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "File Uploader",
  description: "A web app for uploading files to cloud storage",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <SignedIn>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-grow flex flex-col">
                  <Header />
                  {children}
                </main>
              </SidebarProvider>
            </ThemeProvider>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8 h-screen overflow-y-auto p-8">
              <div className="flex flex-col text-center lg:text-left">
                <H1>Welcome to File Uploader</H1>
                <H3>A web app for uploading files to cloud storage</H3>
              </div>
              <div className="flex items-center justify-center">
                <SignIn />
              </div>
            </div>
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
