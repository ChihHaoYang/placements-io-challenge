import { useQuery } from '@tanstack/react-query'

import type { AdjustmentHistory } from '../types'

const fetchLineItemEditHistory = async (lineItemId: number): Promise<AdjustmentHistory[]> => {
  const res = await fetch(`http://localhost:3000/api/line-items/${lineItemId}/history`)

  if (!res.ok) {
    throw new Error('Network response was not ok')
  }

  return res.json()
}

export function useLineItemEditHistory(lineItemId: number | null) {
  return useQuery({
    queryKey: ['history', lineItemId],
    queryFn: async () => {
      if (!lineItemId) return []
      return fetchLineItemEditHistory(lineItemId)
    },
    enabled: !!lineItemId
  })
}
