import rawJson from '../data/placements_teaser_data.json'
import type { Campaign, LineItem, RawDataRow } from '../types'

const RAW_DATA = rawJson as RawDataRow[]

export const normalizeData = () => {
  const campaignsMap = new Map<number, Campaign>()
  const lineItems: LineItem[] = []

  RAW_DATA.forEach((row) => {
    if (!campaignsMap.has(row.campaign_id)) {
      const [advertiser, ...rest] = row.campaign_name.split(' : ')
      const name = rest.join(' : ') || row.campaign_name

      campaignsMap.set(row.campaign_id, {
        id: row.campaign_id,
        name: name.trim(),
        advertiser: advertiser.trim(),
        budget: 0,
        actualSpend: 0,
        utilization: (row.actual_amount / row.booked_amount) * 100
      })
    }

    const campaign = campaignsMap.get(row.campaign_id)!
    campaign.budget += row.booked_amount
    campaign.actualSpend += row.actual_amount

    lineItems.push({
      id: row.id,
      campaignId: row.campaign_id,
      name: row.line_item_name,
      bookedAmount: row.booked_amount,
      actualAmount: row.actual_amount,
      adjustments: row.adjustments,
      billableAmount: row.actual_amount + row.adjustments
    })
  })

  return {
    campaigns: Array.from(campaignsMap.values()),
    lineItems
  }
}

export const db = normalizeData()
