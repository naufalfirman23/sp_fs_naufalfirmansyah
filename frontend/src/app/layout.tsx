import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Project Manager',
  description: 'Fullstack Test Sellerpintar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
