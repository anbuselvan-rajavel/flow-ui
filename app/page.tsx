// app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Flow Orders</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Manage your orders, customers, and inventory easily.
      </p>

      <div className="flex gap-4">
        <Link href="/orders">
          <Button>Go to Orders</Button>
        </Link>
        <Link href="/customers">
          <Button variant="outline">Customers</Button>
        </Link>
        <Link href="/warehouse">
          <Button variant="outline">Warehouse</Button>
        </Link>
      </div>
    </div>
  );
}
