import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { UploadProvider } from "@/contexts/UploadContext";
import UploadStatusModal from "@/components/upload/UploadStatusModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SUMMIT - AI 미팅 HUB",
  description: "AI 기반 회의 요약 및 관리 서비스",
  icons: {
		icon: "/summit.png",
	},
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UploadProvider>
          <Header />
          {children}
          <UploadStatusModal />
        </UploadProvider>
      </body>
    </html>
  );
}
