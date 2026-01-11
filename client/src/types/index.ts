export interface RawDataRow {
  id: number
  campaign_id: number
  campaign_name: string
  line_item_name: string
  booked_amount: number
  actual_amount: number
  adjustments: number
}

export interface Campaign {
  id: number
  name: string
  advertiser: string
  budget: number
  actualSpend: number
  utilization: number
}

export interface LineItem {
  id: number
  campaignId: number
  name: string
  bookedAmount: number
  actualAmount: number
  adjustments: number
  billableAmount: number
}

export interface AdjustmentHistory {
  id: number
  lineItemId: number
  oldValue: number
  newValue: number
  createdAt: string
}
