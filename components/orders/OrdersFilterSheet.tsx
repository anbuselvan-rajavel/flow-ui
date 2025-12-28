"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrdersFilterSheetProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  filters: { customer: string; status: string; country: string };
  setFilters: (val: {
    customer: string;
    status: string;
    country: string;
  }) => void;
  STATUSES: string[];
  COUNTRIES: string[];
}

export function OrdersFilterSheet({
  open,
  onOpenChange,
  filters,
  setFilters,
  STATUSES,
  COUNTRIES,
}: OrdersFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="relative h-screen p-0">
        <SheetHeader>
          <SheetTitle className="bold p-4 pb-0">Filters</SheetTitle>
        </SheetHeader>
         <div className="h-full overflow-y-auto p-6 pb-24 space-y-4">
      <Input
        placeholder="Customer"
        value={filters.customer}
        onChange={(e) =>
          setFilters({ ...filters, customer: e.target.value })
        }
      />

      <select
        className="border rounded p-2 w-full"
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

      <select
        className="border rounded p-2 w-full"
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

    {/* 🔽 FIXED BOTTOM BUTTONS */}
    <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={() =>
          setFilters({ customer: "", status: "", country: "" })
        }
      >
        Reset
      </Button>
      <Button onClick={() => onOpenChange(false)}>Done</Button>
    </div>

      </SheetContent>
    </Sheet>
  );
}
