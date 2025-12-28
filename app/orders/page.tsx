"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersDialog } from "@/components/orders/OrdersDialog";
import { OrdersFilterSheet } from "@/components/orders/OrdersFilterSheet";

const STATUSES = [
  "Order Placed",
  "Payment Confirmed",
  "Order Shipped",
  "Delivered",
];
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    customer: "",
    status: "",
    country: "",
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [current, setCurrent] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  const filtered = useMemo(() => {
    return orders.filter(
      (o) =>
        o.customer.toLowerCase().includes(search.toLowerCase()) &&
        (!filters.customer ||
          o.customer.toLowerCase().includes(filters.customer.toLowerCase())) &&
        (!filters.status || o.status === filters.status) &&
        (!filters.country || o.country === filters.country)
    );
  }, [orders, search, filters]);

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />

      <main className="flex-1 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders</h1>

          <div className="flex gap-2">
            <Input
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" onClick={() => setOpenFilter(true)}>
              Filters{" "}
              {Object.values(filters).filter(Boolean).length
                ? `(${Object.values(filters).filter(Boolean).length})`
                : ""}
            </Button>
            <Button onClick={() => setOpenCreate(true)}>Create</Button>
          </div>
        </div>

        <OrdersTable
          orders={filtered}
          onEdit={(order) => {
            setCurrent(order);
            setOpenEdit(true);
          }}
          onDelete={async (id) => {
            await fetch(`/api/orders/${id}`, { method: "DELETE" });
            setOrders((o) => o.filter((x) => x.id !== id));
            toast.success("Order deleted");
          }}
        />

        <OrdersDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onSave={async (form) => {
            const res = await fetch("/api/orders", {
              method: "POST",
              body: JSON.stringify({ ...form, total: Number(form.total) }),
            });
            const created = await res.json();
            setOrders((o) => [...o, created]);
            setOpenCreate(false);
            toast.success("Order created");
          }}
        />

        <OrdersDialog
          open={openEdit}
          onOpenChange={setOpenEdit}
          onSave={async (form) => {
            if (!current) return;
            const res = await fetch(`/api/orders/${current.id}`, {
              method: "PUT",
              body: JSON.stringify(form),
            });
            const updated = await res.json();
            setOrders((o) => o.map((x) => (x.id === updated.id ? updated : x)));
            setOpenEdit(false);
            toast.success("Order updated");
          }}
          order={current || undefined}
        />

        <OrdersFilterSheet
          open={openFilter}
          onOpenChange={setOpenFilter}
          filters={filters}
          setFilters={setFilters}
          STATUSES={STATUSES}
          COUNTRIES={COUNTRIES}
        />
      </main>
    </div>
  );
}
