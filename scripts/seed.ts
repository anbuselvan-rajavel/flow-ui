import "dotenv/config";  // Add this line
import { db } from "../db";
import { orders } from "../db/schema";

async function seed() {
  await db.insert(orders).values([
    {
      customer: "Divyasakthi",
      country: "India", 
      status: "Order Placed",
      total: 4500,
    },
    {
      customer: "John",
      country: "USA",
      status: "Delivered",
      total: 12000,
    },
  ]);
  console.log("Seeded");
  process.exit(0);
}

seed();
