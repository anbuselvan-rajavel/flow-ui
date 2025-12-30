import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const result = await db
    .update(orders)
    .set({
      customer: body.customer,
      country: body.country,
      status: body.status,
      total: Number(body.total),
    })
    .where(eq(orders.id, Number(params.id)))
    .returning();

  // 🚨 IMPORTANT SAFETY CHECK
  if (!result.length) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(result[0]); // ✅ ALWAYS JSON
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await db.delete(orders).where(eq(orders.id, Number(params.id)));
  return NextResponse.json({ success: true });
}
