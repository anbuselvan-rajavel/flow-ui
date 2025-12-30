"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersDialog } from "@/components/orders/OrdersDialog";
import { OrdersFilterSheet } from "@/components/orders/OrdersFilterSheet";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  //  stable string (IMPORTANT)
  const queryString = searchParams.toString();

  const [orders, setOrders] = useState<any[]>([]);
  const [openFilter, setOpenFilter] = useState(false);

  //  filters only for UI
  const [filters, setFilters] = useState({
    customer: searchParams.get("customer") || "",
    status: searchParams.get("status") || "",
    country: searchParams.get("country") || "",
  });

  const STATUSES = ["pending", "paid", "shipped", "cancelled"];
  const COUNTRIES = ["India", "USA", "UK", "Germany"];

  // ========================
  // FETCH ORDERS (SAFE)
  // ========================
  useEffect(() => {
    fetch(`/api/orders?${queryString}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  }, [queryString]); //  SAFE dependency

  // ========================
  // CLIENT SEARCH
  // ========================
  const filteredOrders = useMemo(() => {
    if (!filters.customer) return orders;
    return orders.filter((o) =>
      o.customer.toLowerCase().includes(filters.customer.toLowerCase())
    );
  }, [orders, filters.customer]);

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Search customer..."
            value={filters.customer}
            onChange={(e) =>
              setFilters({ ...filters, customer: e.target.value })
            }
          />

          <Button variant="outline" onClick={() => setOpenFilter(true)}>
            Filters
          </Button>

          <Button onClick={() => router.push("/orders?dialog=create")}>
            Create
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <OrdersTable
        orders={filteredOrders}
        onEdit={(order) =>
          router.push(`/orders?dialog=edit&id=${order.id}`)
        }
        onDelete={async (id) => {
          await fetch(`/api/orders/${id}`, { method: "DELETE" });
          setOrders((o) => o.filter((x) => x.id !== id));
        }}
      />

      {/* DIALOG */}
      <OrdersDialog orders={orders} setOrders={setOrders} />

      {/* FILTER SHEET */}
      <OrdersFilterSheet
        open={openFilter}
        onOpenChange={setOpenFilter}
        filters={filters}
        setFilters={setFilters}
        STATUSES={STATUSES}
        COUNTRIES={COUNTRIES}
      />
    </div>
  );
}
