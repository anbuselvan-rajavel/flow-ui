// components/orders/OrdersTable.tsx
"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Order = {
  id: number;
  customer: string;
  country: string;
  status: string;
  total: number;
  createdAt: string;
};

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}

export function OrdersTable({ orders, onEdit, onDelete }: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = 10;
  
  // 🔹 Memoize current page to prevent recalculation
  const currentPage = useMemo(() => {
    return Number(searchParams.get("page") ?? 1);
  }, [searchParams]);

  // 🔹 Memoize paged orders to prevent infinite loop
  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return orders.slice(start, end);
  }, [orders, currentPage]);

  // 🔹 Memoize total pages
  const totalPages = useMemo(() => {
    return Math.ceil(orders.length / pageSize);
  }, [orders.length]);

  const columns: ColumnDef<Order>[] = useMemo(() => [
    {
      id: "sno",
      header: "S.No",
      cell: ({ row }) => (currentPage - 1) * pageSize + row.index + 1,
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "total", header: "Total" },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [currentPage, onEdit, onDelete]);

  const table = useReactTable({
    data: pagedOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // 🔹 Add manual pagination
    pageCount: totalPages,
  });

  // 🔹 Update page in URL
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/orders?${params.toString()}`);
  }

  return (
    <>
      <table className="w-full border rounded-md">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="border p-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="border p-4 text-center text-muted-foreground">
                No orders found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔽 Pagination */}
      <div className="flex justify-end gap-2 mt-3">
        <Button 
          variant="outline" 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="px-2 py-1 text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}