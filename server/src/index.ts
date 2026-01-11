import "dotenv/config";
import { stringify } from "csv-stringify/sync";
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

app.get("/api/export", async (c) => {
  // Get all campaigns with line items count
  // It's okay to fetch all data here for export for such a small dataset
  const campaigns = await prisma.campaign.findMany({
    include: { lineItems: true },
    orderBy: { id: "asc" },
  });

  // Note: in JavaScript, it could be not accurate for the calculation of floating point numbers.
  // For production usage, should consider other languages
  const csvData = campaigns.map((camp) => {
    const totalBooked = camp.lineItems.reduce(
      (sum, item) => sum + item.bookedAmount,
      0
    );
    const totalActual = camp.lineItems.reduce(
      (sum, item) => sum + item.actualAmount + item.adjustments,
      0
    );

    return {
      ID: camp.id,
      Name: camp.name,
      Advertiser: camp.advertiser,
      Utilization:
        totalBooked === 0
          ? "0.00%"
          : ((totalActual / totalBooked) * 100).toFixed(2) + "%",
      "Booked Budget": totalBooked,
      "Actual Spend": totalActual,
      "Line Item Count": camp.lineItems.length,
    };
  });

  // Transfer to CSV string
  const csvString = stringify(csvData, {
    header: true,
    columns: [
      "ID",
      "Name",
      "Advertiser",
      "Utilization",
      "Booked Budget",
      "Actual Spend",
      "Line Item Count",
    ],
  });

  return new Response(csvString, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="campaigns_export_${Date.now()}.csv"`,
    },
  });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
