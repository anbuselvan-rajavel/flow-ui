// app/layout.tsx
import "@/globals.css"; // Works because Next.js path alias @ -> project root
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
