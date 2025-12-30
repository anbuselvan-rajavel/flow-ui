// app/api/orders/[id]/route.ts
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise
    const { id } = await context.params;
    const body = await req.json();

    console.log("PUT /api/orders/[id] - ID:", id);
    console.log("Body:", body);

    // Validate input
    if (!body.customer || !body.country || !body.status || !body.total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .update(orders)
      .set({
        customer: body.customer,
        country: body.country,
        status: body.status,
        total: Number(body.total),
      })
      .where(eq(orders.id, Number(id)))
      .returning();

    console.log("Update result:", result);

    // 🚨 IMPORTANT SAFETY CHECK
    if (!result.length) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise
    const { id } = await context.params;

    console.log("DELETE /api/orders/[id] - ID:", id);

    const result = await db
      .delete(orders)
      .where(eq(orders.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: result[0] });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}