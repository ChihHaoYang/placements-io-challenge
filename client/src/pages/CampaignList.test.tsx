import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { describe, expect, it, type Mock, vi } from 'vitest'

import * as useCampaignsHook from '../hooks/useCampaigns'
import CampaignList from './CampaignList'

vi.mock('../hooks/useCampaigns')

const renderPage = () => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        <CampaignList />
      </BrowserRouter>
    </MantineProvider>
  )
}

describe('CampaignList', () => {
  it('shows loading state initially', () => {
    ;(useCampaignsHook.useCampaigns as Mock).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false
    })

    renderPage()
    expect(screen.queryByText('View Invoice')).not.toBeInTheDocument()
  })

  it('renders campaigns when data is loaded', () => {
    ;(useCampaignsHook.useCampaigns as Mock).mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            name: 'Nike Q1',
            advertiser: 'Nike',
            budget: 1000,
            actualSpend: 500,
            status: 'Active'
          }
        ],
        meta: { totalPages: 1 }
      },
      isPending: false,
      isError: false
    })

    renderPage()

    expect(screen.getByText('Nike Q1')).toBeInTheDocument()
    expect(screen.getByText('Nike')).toBeInTheDocument()
  })
})
