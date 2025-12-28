CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer" text NOT NULL,
	"country" text NOT NULL,
	"status" text NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
