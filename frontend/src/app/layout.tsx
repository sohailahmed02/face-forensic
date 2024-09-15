import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./component/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Face view",
  description: "Developed by Sohail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
      <div className='flex'>
          <div className='bg-[#202123] max-w-xs h-screen overflow-y-auto md:min-w-[08rem] lg:max-w'>
            <Sidebar/>
          </div>
          {/* bg-[#343541] */}
          <div className='flex-1'>
            {children}
          </div>
        </div>      
        </body>
    </html>
  );
}
