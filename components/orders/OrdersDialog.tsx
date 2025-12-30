// components/orders/OrdersDialog.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
];

const STATUSES = [
  "Order Placed",
  "Payment Confirmed",
  "Order Shipped",
  "Delivered",
];

export function OrdersDialog({
  orders,
  setOrders,
}: {
  orders: any[];
  setOrders: Function;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dialog = useMemo(() => searchParams.get("dialog"), [searchParams]);
  const id = useMemo(() => searchParams.get("id"), [searchParams]);

  const isOpen = dialog === "create" || dialog === "edit";

  const order = useMemo(() => {
    return dialog === "edit" ? orders.find((o) => String(o.id) === id) : null;
  }, [dialog, orders, id]);

  const [form, setForm] = useState({
    customer: "",
    country: "",
    status: "Order Placed",
    total: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Sync form with order when dialog opens or order changes
  useEffect(() => {
    if (order) {
      setForm({
        customer: order.customer,
        country: order.country,
        status: order.status,
        total: String(order.total),
      });
    } else if (dialog === "create") {
      setForm({
        customer: "",
        country: "",
        status: "Order Placed",
        total: "",
      });
    }
  }, [order, dialog]);

  // Form validation
  const isValid = useMemo(() => {
    return (
      form.customer.trim() &&
      form.country &&
      form.status &&
      Number(form.total) > 0
    );
  }, [form]);

  // Close handler
  const close = useCallback(() => {
    router.push("/orders");
  }, [router]);

  // Save order handler
  const save = useCallback(async () => {
    if (!isValid || isSaving) return;

    setIsSaving(true);
    try {
      let data: any;

      if (dialog === "create") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, total: Number(form.total) }),
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.details || 'Failed to create order');
        }
        data = await res.json();
        setOrders((o: any[]) => [...o, data]);
      }

      if (dialog === "edit" && order) {
        const res = await fetch(`/api/orders/${order.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, total: Number(form.total) }),
        });
        
        if (!res.ok) {
          const error = await res.json();
          console.error("Update failed:", error);
          throw new Error(error.details || 'Failed to update order');
        }
        data = await res.json();
        setOrders((o: any[]) =>
          o.map((x) => (x.id === data.id ? data : x))
        );
      }

      close();
    } catch (err) {
      console.error("Failed to save order:", err);
      alert(err instanceof Error ? err.message : "Failed to save order");
    } finally {
      setIsSaving(false);
    }
  }, [isValid, isSaving, dialog, form, order, setOrders, close]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Enter" && isValid && !isSaving) {
        e.preventDefault();
        save();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isValid, isSaving, save, close]);

  if (!isOpen) return null;

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="space-y-3">
        <DialogHeader>
          <DialogTitle>
            {dialog === "edit" ? "Edit Order" : "Create Order"}
          </DialogTitle>
        </DialogHeader>

        {/* Customer */}
        <Input
          placeholder="Customer"
          value={form.customer}
          onChange={(e) =>
            setForm({ ...form, customer: e.target.value })
          }
          disabled={isSaving}
        />

        {/* Country */}
        <Select
          value={form.country}
          onValueChange={(val) =>
            setForm({ ...form, country: val })
          }
          disabled={isSaving}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={form.status}
          onValueChange={(val) =>
            setForm({ ...form, status: val })
          }
          disabled={isSaving}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Total */}
        <Input
          type="number"
          placeholder="Total"
          value={form.total}
          onChange={(e) =>
            setForm({ ...form, total: e.target.value })
          }
          disabled={isSaving}
        />

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={close}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            disabled={!isValid || isSaving} 
            onClick={save}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}