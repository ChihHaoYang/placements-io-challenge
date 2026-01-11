import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { BASE_URL } from '../api'
import type { Campaign, LineItem } from '../types'

interface CampaignDetail extends Campaign {
  lineItems: LineItem[]
}

const fetchCampaignDetail = async (id: string): Promise<CampaignDetail> => {
  const res = await fetch(`${BASE_URL}/campaigns/${id}`)
  if (!res.ok) throw new Error('Failed to fetch campaign')
  return res.json()
}

const updateAdjustment = async ({ id, adjustments }: { id: number; adjustments: number }) => {
  const res = await fetch(`${BASE_URL}/line-items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adjustments })
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export function useCampaignDetail(id: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaignDetail(id),
    enabled: !!id
  })

  const mutation = useMutation({
    mutationFn: updateAdjustment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] })
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['history', variables.id] })
    }
  })

  return { ...query, updateLineItem: mutation.mutate }
}
