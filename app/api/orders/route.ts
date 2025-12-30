// app/api/orders/route.ts
import { db } from "@/db";
import { orders } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, ilike } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const customer = searchParams.get("customer");
    const status = searchParams.get("status");
    const country = searchParams.get("country");

    console.log("GET /api/orders - Filters:", { customer, status, country });

    // Build where conditions
    const conditions = [];
    
    if (customer) {
      conditions.push(ilike(orders.customer, `%${customer}%`));
    }
    if (status) {
      conditions.push(eq(orders.status, status));
    }
    if (country) {
      conditions.push(eq(orders.country, country));
    }

    // Fetch with filters if any, otherwise fetch all
    const data = conditions.length > 0
      ? await db.select().from(orders).where(and(...conditions))
      : await db.select().from(orders);

    console.log(`GET /api/orders - Returning ${data.length} orders`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("POST /api/orders - Body:", body);

    // Validate input
    if (!body.customer || !body.country || !body.status || body.total === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: customer, country, status, total" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(orders)
      .values({
        customer: body.customer,
        country: body.country,
        status: body.status,
        total: Number(body.total),
      })
      .returning();

    console.log("POST /api/orders - Created:", created);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}