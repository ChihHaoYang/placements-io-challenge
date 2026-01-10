import { useQuery } from '@tanstack/react-query'

import type { Campaign } from '../types'
import { db } from '../utils/data'

const fetchCampaigns = async (): Promise<Campaign[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  return db.campaigns
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns
  })
}
