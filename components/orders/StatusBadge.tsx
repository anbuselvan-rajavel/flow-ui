// components/orders/StatusBadge.tsx
export function StatusBadge({ status }: { status: string }) {
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

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}
