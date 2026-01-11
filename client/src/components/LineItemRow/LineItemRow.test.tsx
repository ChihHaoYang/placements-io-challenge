import { Table } from '@mantine/core'
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../../test/render'
import type { LineItem } from '../../types'
import { LineItemRow } from './LineItemRow'

const mockItem: LineItem = {
  id: 1,
  campaignId: 101,
  name: 'Test Item',
  bookedAmount: 1000,
  actualAmount: 500,
  adjustments: 0,
  billableAmount: 500
}

const renderWithMantine = (ui: React.ReactNode) => {
  return render(ui)
}

describe('LineItemRow', () => {
  it('renders item details correctly', () => {
    renderWithMantine(
      <Table>
        <Table.Tbody>
          <LineItemRow item={mockItem} onUpdate={() => {}} onShowHistory={() => {}} />
        </Table.Tbody>
      </Table>
    )

    expect(screen.getByText('Test Item')).toBeInTheDocument()
    expect(screen.getByDisplayValue('$ 0')).toBeInTheDocument()
  })

  it('debounces the update callback', async () => {
    const mockOnUpdate = vi.fn()

    vi.useFakeTimers()

    renderWithMantine(
      <Table>
        <Table.Tbody>
          <LineItemRow item={mockItem} onUpdate={mockOnUpdate} onShowHistory={() => {}} />
        </Table.Tbody>
      </Table>
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '500' } })

    expect(mockOnUpdate).not.toHaveBeenCalled()

    vi.advanceTimersByTime(800)

    expect(mockOnUpdate).toHaveBeenCalledTimes(1)
    expect(mockOnUpdate).toHaveBeenCalledWith(1, 500)

    vi.useRealTimers()
  })
})
