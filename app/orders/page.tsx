// app/orders/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersDialog } from "@/components/orders/OrdersDialog";
import { OrdersFilterSheet } from "@/components/orders/OrdersFilterSheet";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Memoize query string to prevent unnecessary re-fetches
  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  // 🔹 filters for UI (client-side search)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("customer") || "");

  const STATUSES = ["Order Placed", "Payment Confirmed", "Order Shipped", "Delivered"];
  const COUNTRIES = ["India", "United States", "United Kingdom", "Germany", "France", "Australia"];

  // ========================
  // FETCH ORDERS (SAFE)
  // ========================
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/orders?${queryString}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setOrders(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [queryString]);

  // ========================
  // CLIENT-SIDE SEARCH
  // ========================
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    
    const term = searchTerm.toLowerCase();
    return orders.filter((o) =>
      o.customer.toLowerCase().includes(term) ||
      o.country.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  // ========================
  // HANDLERS
  // ========================
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.details || 'Failed to delete order');
      }
      
      setOrders((prevOrders) => prevOrders.filter((x) => x.id !== id));
    } catch (err) {
      console.error('Error deleting order:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete order');
    }
  }, []);

  const handleEdit = useCallback((order: any) => {
    router.push(`/orders?dialog=edit&id=${order.id}`);
  }, [router]);

  const handleCreate = useCallback(() => {
    router.push("/orders?dialog=create");
  }, [router]);

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Search customer or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />

          <Button variant="outline" onClick={() => setOpenFilter(true)}>
            Filters
          </Button>

          <Button onClick={handleCreate}>
            Create Order
          </Button>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading orders...
        </div>
      ) : (
        /* TABLE */
        <OrdersTable
          orders={filteredOrders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* DIALOG */}
      <OrdersDialog orders={orders} setOrders={setOrders} />

      {/* FILTER SHEET */}
      <OrdersFilterSheet
        open={openFilter}
        onOpenChange={setOpenFilter}
        STATUSES={STATUSES}
        COUNTRIES={COUNTRIES}
      />
    </div>
  );
}