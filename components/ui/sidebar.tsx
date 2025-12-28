import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4 flex flex-col">
      
      {/* Profile */}
      <div className="mb-6">
        <p className="font-semibold">Divya</p>
        <p className="text-sm text-muted-foreground">Admin</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 text-sm">
        <Link
          href="/dashboard"
          className="block px-3 py-2 rounded hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          href="/orders"
          className="block px-3 py-2 rounded bg-gray-100 font-medium"
        >
          Orders
        </Link>

        <Link
          href="/customers"
          className="block px-3 py-2 rounded hover:bg-gray-100"
        >
          Customers
        </Link>

        {/* Warehouse Dropdown */}
        <details className="px-3 py-2 rounded hover:bg-gray-100">
          <summary className="cursor-pointer select-none">
            Warehouse
          </summary>

          <div className="ml-4 mt-2 space-y-1">
            <p className="cursor-pointer hover:underline">Stock</p>
            <p className="cursor-pointer hover:underline">Inventory</p>
          </div>
        </details>
      </nav>

      {/* Sidebar Search */}
      <input
        placeholder="Search..."
        className="border rounded px-3 py-2 text-sm mt-4"
      />
    </aside>
  );
}
