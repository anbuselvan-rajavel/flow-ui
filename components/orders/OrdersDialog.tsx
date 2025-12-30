"use client";

import { useEffect, useMemo, useState } from "react";
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

  const dialog = searchParams.get("dialog"); // "create" or "edit"
  const id = searchParams.get("id"); // order id for edit

  const isOpen = dialog === "create" || dialog === "edit";

  const order =
    dialog === "edit"
      ? orders.find((o) => String(o.id) === id)
      : null;

  const [form, setForm] = useState({
    customer: "",
    country: "",
    status: "Order Placed",
    total: "",
  });

  // Sync form with order
  useEffect(() => {
    if (order) {
      setForm({
        customer: order.customer,
        country: order.country,
        status: order.status,
        total: String(order.total),
      });
    } else {
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

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "Enter" && isValid) {
        e.preventDefault();
        save();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isValid, form]);

  function close() {
    router.push("/orders");
  }

  // Save order
  async function save() {
    if (!isValid) return;

    try {
      let data: any;

      if (dialog === "create") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, total: Number(form.total) }),
        });
        data = await res.json();
        setOrders((o: any[]) => [...o, data]);
      }

      if (dialog === "edit" && order) {
        const res = await fetch(`/api/orders/${order.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, total: Number(form.total) }),
        });
        if (res.ok) {
          data = await res.json();
          setOrders((o: any[]) =>
            o.map((x) => (x.id === data.id ? data : x))
          );
        }
      }

      close();
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  }

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
        />

        {/* Country */}
        <Select
          value={form.country}
          onValueChange={(val) =>
            setForm({ ...form, country: val })
          }
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
        />

        <DialogFooter>
          <Button disabled={!isValid} onClick={save}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
