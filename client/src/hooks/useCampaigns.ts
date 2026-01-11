import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { BASE_URL } from '../api'
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
  const res = await fetch(`${BASE_URL}/campaigns?page=${page}&pageSize=${pageSize}`)

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
