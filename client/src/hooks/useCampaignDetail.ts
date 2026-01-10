import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Campaign, LineItem } from '../types'

interface CampaignDetail extends Campaign {
  lineItems: LineItem[]
}

const fetchCampaignDetail = async (id: string): Promise<CampaignDetail> => {
  const res = await fetch(`http://localhost:3000/api/campaigns/${id}`)
  if (!res.ok) throw new Error('Failed to fetch campaign')
  return res.json()
}

const updateAdjustment = async ({ id, adjustments }: { id: number; adjustments: number }) => {
  const res = await fetch(`http://localhost:3000/api/line-items/${id}`, {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] })
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    }
  })

  return { ...query, updateLineItem: mutation.mutate }
}
