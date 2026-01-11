import { MantineProvider } from '@mantine/core'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../../test/render'
import { AnimatedNumber } from './AnimatedNumber'

const renderWithMantine = (ui: React.ReactNode) => {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

interface MockCountUpProps {
  end: number
  prefix?: string
  formattingFn?: (value: number) => string
  separator?: string
  decimals?: number
  decimal?: string
}

vi.mock('react-countup', () => ({
  default: ({
    end,
    prefix = '',
    formattingFn,
    separator = ',',
    decimals = 0,
    decimal = '.'
  }: MockCountUpProps) => {
    let displayValue
    if (formattingFn) {
      displayValue = formattingFn(end)
    } else {
      const parts = end.toFixed(decimals).split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      displayValue = `${prefix}${parts.join(decimal)}`
    }
    return <span>{displayValue}</span>
  }
}))

describe('AnimatedNumber', () => {
  it('renders standard number with formatting', async () => {
    renderWithMantine(<AnimatedNumber value={1234.56} prefix="$" />)

    await waitFor(() => {
      expect(screen.getByText('$1,234.56')).toBeInTheDocument()
    })
  })

  it('renders compact number notation', async () => {
    renderWithMantine(<AnimatedNumber value={1500} compact />)

    await waitFor(() => {
      expect(screen.getByText('$1.5K')).toBeInTheDocument()
    })
  })

  it('renders large compact number correctly', async () => {
    renderWithMantine(<AnimatedNumber value={2500000} compact />)

    await waitFor(() => {
      expect(screen.getByText('$2.5M')).toBeInTheDocument()
    })
  })

  it('applies correct styles for compact mode', async () => {
    renderWithMantine(<AnimatedNumber value={1000} compact />)

    const element = await screen.findByText('$1K')

    const textParent = element.closest('.mantine-Text-root')
    expect(textParent).toHaveStyle({ cursor: 'help' })
    expect(textParent).toHaveStyle({ fontVariantNumeric: 'tabular-nums' })
  })

  it('renders tooltip with full value in compact mode', async () => {
    renderWithMantine(<AnimatedNumber value={1234567} compact />)

    await waitFor(() => {
      expect(screen.getByText('$1.23M')).toBeInTheDocument()
    })
  })
})
