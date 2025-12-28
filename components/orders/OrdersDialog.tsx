"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderForm {
  customer: string;
  country: string;
  status: string;
  total: string;
}

interface OrdersDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onSave: (data: OrderForm) => void;
  order?: OrderForm;
}

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

const EMPTY_FORM: OrderForm = {
  customer: "",
  country: "",
  status: "Order Placed",
  total: "",
};

export function OrdersDialog({
  open,
  onOpenChange,
  onSave,
  order,
}: OrdersDialogProps) {
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);

  // 🔥 THIS FIXES EDIT BUTTON
  useEffect(() => {
    if (order) {
      setForm(order);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [order, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-3">
        <DialogHeader>
          <DialogTitle>
            {order ? "Edit Order" : "Create Order"}
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Customer"
          value={form.customer}
          onChange={(e) =>
            setForm((f) => ({ ...f, customer: e.target.value }))
          }
        />

        <select
          className="w-full border rounded-md p-2"
          value={form.country}
          onChange={(e) =>
            setForm((f) => ({ ...f, country: e.target.value }))
          }
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="w-full border rounded-md p-2"
          value={form.status}
          onChange={(e) =>
            setForm((f) => ({ ...f, status: e.target.value }))
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <Input
          type="number"
          placeholder="Total"
          value={form.total}
          onChange={(e) =>
            setForm((f) => ({ ...f, total: e.target.value }))
          }
        />

        <DialogFooter>
          <Button
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
