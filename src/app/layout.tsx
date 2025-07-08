import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import TopNavigtion from "@/components/TopNavigation/TopNavigation";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "LSW 개발 블로그",
  description: "주니어 프론트엔드 개발자를 목표로 두는 주니어주니어 개발자 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansKR.variable} antialiased`}
      >
      <TopNavigtion></TopNavigtion>
        {children}
      </body>
    </html>
  );
}
