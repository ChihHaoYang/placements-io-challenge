import { prisma } from "../prisma/prisma";
import { type Campaign } from "../generated/prisma/client";
import rawJson from "./source.json";

const RAW_DATA = rawJson as {
  id: number;
  campaign_id: number;
  campaign_name: string;
  line_item_name: string;
  booked_amount: number;
  actual_amount: number;
  adjustments: number;
}[];

async function main() {
  await prisma.lineItem.deleteMany();
  await prisma.campaign.deleteMany();

  const campaignsMap = new Map<number, Campaign>();

  for (const row of RAW_DATA) {
    if (!campaignsMap.has(row.campaign_id)) {
      const [advertiser, ...rest] = row.campaign_name.split(" : ");
      const name = rest.join(" : ") || row.campaign_name;

      campaignsMap.set(row.campaign_id, {
        id: row.campaign_id,
        name: name.trim(),
        advertiser: advertiser.trim(),
      });
    }
  }

  console.log(`Creating ${campaignsMap.size} campaigns...`);
  await prisma.campaign.createMany({
    data: Array.from(campaignsMap.values()),
  });

  console.log(`Creating ${RAW_DATA.length} line items...`);

  await prisma.lineItem.createMany({
    data: RAW_DATA.map((row) => ({
      id: row.id,
      campaignId: row.campaign_id,
      name: row.line_item_name,
      bookedAmount: row.booked_amount,
      actualAmount: row.actual_amount,
      adjustments: row.adjustments,
    })),
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
