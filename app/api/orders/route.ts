import { NextResponse } from "next/server";

let orders = [
  {
    id: 1,
    customer: "Divya",
    country: "India",
    status: "Order Placed",
    total: 3000,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newOrder = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...body,
  };

  orders.push(newOrder);
  return NextResponse.json(newOrder);
}

export async function PUT(req: Request) {
  const body = await req.json();

  orders = orders.map((o) =>
    o.id === body.id ? { ...o, ...body } : o
  );

  const updated = orders.find((o) => o.id === body.id);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  orders = orders.filter((o) => o.id !== id);
  return NextResponse.json({ success: true });
}
