// components/orders/OrdersFilterSheet.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface OrdersFilterSheetProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  STATUSES: string[];
  COUNTRIES: string[];
}

export function OrdersFilterSheet({
  open,
  onOpenChange,
  STATUSES,
  COUNTRIES,
}: OrdersFilterSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevOpenRef = useRef(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    customer: searchParams.get("customer") || "",
    status: searchParams.get("status") || "",
    country: searchParams.get("country") || "",
  });

  // Sync filters with URL when sheet opens
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      prevOpenRef.current = true;
    } else if (!open) {
      prevOpenRef.current = false;
    }
  }, [open]);

  // 🔹 Apply filters to URL
  const applyFiltersToURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.customer.trim()) {
      params.set("customer", filters.customer.trim());
    } else {
      params.delete("customer");
    }

    if (filters.status) {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }

    if (filters.country) {
      params.set("country", filters.country);
    } else {
      params.delete("country");
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`/orders?${params.toString()}`);
    onOpenChange(false);
  }, [filters, searchParams, router, onOpenChange]);

  // 🔹 Reset filters + URL
  const resetFilters = useCallback(() => {
    setFilters({
      customer: "",
      status: "",
      country: "",
    });

    const params = new URLSearchParams();
    params.set("page", "1");

    router.push(`/orders?${params.toString()}`);
    onOpenChange(false);
  }, [router, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="relative h-screen p-0 flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="font-bold">
            Filters
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Customer */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Customer
            </label>
            <Input
              placeholder="Search customer..."
              value={filters.customer}
              onChange={(e) =>
                setFilters({ ...filters, customer: e.target.value })
              }
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Status
            </label>
            <select
              className="border rounded-md p-2 w-full h-9 bg-background"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Country
            </label>
            <select
              className="border rounded-md p-2 w-full h-9 bg-background"
              value={filters.country}
              onChange={(e) =>
                setFilters({ ...filters, country: e.target.value })
              }
            >
              <option value="">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔽 Fixed bottom buttons */}
        <div className="border-t bg-background p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
          <Button onClick={applyFiltersToURL}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}