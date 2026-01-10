import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const app = new Hono();
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({
  adapter,
});

app.use("/*", cors());

// /api/campaigns
app.get("/api/campaigns", async (c) => {
  const page = Number(c.req.query("page") || 1);
  const pageSize = Number(c.req.query("pageSize") || 10);
  const skip = (page - 1) * pageSize;

  const total = await prisma.campaign.count();

  const campaigns = await prisma.campaign.findMany({
    skip,
    take: pageSize,
    include: {
      lineItems: true,
    },
    orderBy: { id: "asc" },
  });

  const processedData = campaigns.map((camp) => {
    const totalBooked = camp.lineItems.reduce(
      (sum, item) => sum + item.bookedAmount,
      0
    );
    const totalActual = camp.lineItems.reduce(
      (sum, item) => sum + item.actualAmount + item.adjustments,
      0
    );

    return {
      id: camp.id,
      name: camp.name,
      advertiser: camp.advertiser,
      budget: totalBooked,
      actualSpend: totalActual,
    };
  });

  return c.json({
    data: processedData,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

// GET /api/campaigns/:id
app.get("/api/campaigns/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      lineItems: {
        orderBy: { id: "asc" },
      },
    },
  });

  if (!campaign) return c.json({ error: "Not Found" }, 404);

  const totalBooked = campaign.lineItems.reduce(
    (sum, item) => sum + item.bookedAmount,
    0
  );
  const totalActual = campaign.lineItems.reduce(
    (sum, item) => sum + item.actualAmount + item.adjustments,
    0
  );

  return c.json({
    ...campaign,
    budget: totalBooked,
    actualSpend: totalActual,
  });
});

// PATCH /api/line-items/:id
app.patch("/api/line-items/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  if (typeof body.adjustments !== "number") {
    return c.json({ error: "Invalid adjustments value" }, 400);
  }

  try {
    const updatedLineItem = await prisma.lineItem.update({
      where: { id },
      data: {
        adjustments: body.adjustments,
      },
    });
    return c.json(updatedLineItem);
  } catch (e) {
    return c.json({ error: "Update failed" }, 500);
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
