-- CreateTable
CREATE TABLE "AdjustmentHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lineItemId" INTEGER NOT NULL,
    "oldValue" REAL NOT NULL,
    "newValue" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    CONSTRAINT "AdjustmentHistory_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AdjustmentHistory_lineItemId_idx" ON "AdjustmentHistory"("lineItemId");
