"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function StatusBadge({ status }: { status: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const color =
    status === "Order Placed"
      ? "bg-blue-100 text-blue-700"
      : status === "Payment Confirmed"
      ? "bg-purple-100 text-purple-700"
      : status === "Order Shipped"
      ? "bg-orange-100 text-orange-700"
      : status === "Delivered"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  function applyStatusFilter() {
    const params = new URLSearchParams(searchParams);

    params.set("status", status); // 🔥 SET PARAM
    params.set("page", "1"); // reset pagination

    router.push(`/orders?${params.toString()}`);
  }

  return (
    <span
      onClick={applyStatusFilter}
      className={`px-2 py-1 rounded-md text-xs font-medium cursor-pointer hover:opacity-80 ${color}`}
      title="Click to filter by status"
    >
      {status}
    </span>
  );
}
