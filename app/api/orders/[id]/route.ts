import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  // update DB
  const updatedOrder = {
    id: Number(params.id),
    ...body,
    total: Number(body.total ?? 0),
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(updatedOrder);
}
/* export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const [updated] = await db
    .update(orders)
    .set(body)
    .where(eq(orders.id, Number(params.id)))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: any) {
  await db.delete(orders).where(eq(orders.id, Number(params.id)));
  return NextResponse.json({ success: true });
}
*/