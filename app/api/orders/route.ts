import { db } from "@/db";
import { orders } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(orders);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const [created] = await db
    .insert(orders)
    .values({
      customer: body.customer,
      country: body.country,
      status: body.status,
      total: Number(body.total),
    })
    .returning();

  return NextResponse.json(created);
}
