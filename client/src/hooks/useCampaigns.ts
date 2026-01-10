import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { Campaign } from '../types'

interface CampaignsResponse {
  data: Campaign[]
  meta: {
    total: number
    page: number
    totalPages: number
  }
}

const fetchCampaigns = async (page: number, pageSize: number): Promise<CampaignsResponse> => {
  const res = await fetch(`http://localhost:3000/api/campaigns?page=${page}&pageSize=${pageSize}`)

  if (!res.ok) {
    throw new Error('Network response was not ok')
  }

  return res.json()
}

export function useCampaigns(page: number, pageSize: number) {
  return useQuery({
    queryKey: ['campaigns', page, pageSize],
    queryFn: () => fetchCampaigns(page, pageSize),
    placeholderData: keepPreviousData
  })
}
