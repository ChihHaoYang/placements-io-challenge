-- CreateTable
CREATE TABLE "Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "advertiser" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "campaignId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "bookedAmount" REAL NOT NULL,
    "actualAmount" REAL NOT NULL,
    "adjustments" REAL NOT NULL,
    CONSTRAINT "LineItem_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LineItem_campaignId_idx" ON "LineItem"("campaignId");
