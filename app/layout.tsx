import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/Styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import BackgroundVideo from "@/app/components/Background";

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
  title: "Anime Zone",
  description: "Save your favorite animes here!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full`}
      >
        <ClerkProvider>
          <BackgroundVideo />
        {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
