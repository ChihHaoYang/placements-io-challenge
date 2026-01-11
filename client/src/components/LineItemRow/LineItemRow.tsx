import { ActionIcon, Flex, NumberFormatter, NumberInput, Table, Text, Tooltip } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { IconHistory } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import type { LineItem } from '../../types'

export interface LineItemRowProps {
  item: LineItem
  onUpdate: (id: number, val: number) => void
  onShowHistory?: () => void
}

export function LineItemRow({ item, onUpdate, onShowHistory }: LineItemRowProps) {
  const [localAdjustment, setLocalAdjustment] = useState<number | string>(item.adjustments)

  useEffect(() => {
    // eslint-disable-next-line
    setLocalAdjustment(item.adjustments)
  }, [item.adjustments])

  const handleDebouncedUpdate = useDebouncedCallback((val: number | string) => {
    onUpdate(item.id, Number(val))
  }, 800)

  return (
    <Table.Tr>
      <Table.Td>
        <Text fw={500}>{item.name}</Text>
      </Table.Td>
      <Table.Td ta="right">
        <NumberFormatter prefix="$ " value={item.bookedAmount} thousandSeparator decimalScale={2} />
      </Table.Td>
      <Table.Td ta="right">
        <NumberFormatter prefix="$ " value={item.actualAmount} thousandSeparator decimalScale={2} />
      </Table.Td>
      <Table.Td ta="right">
        <Flex justify="flex-end" align="center">
          <NumberInput
            value={localAdjustment}
            decimalScale={2}
            prefix="$ "
            onChange={(val) => {
              setLocalAdjustment(val)
              handleDebouncedUpdate(val)
            }}
            allowNegative
          />
          {onShowHistory && (
            <Tooltip label="View Change History">
              <ActionIcon variant="light" color="gray" onClick={onShowHistory}>
                <IconHistory size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Flex>
      </Table.Td>
      <Table.Td ta="right">
        <Text fw={700}>
          <NumberFormatter
            prefix="$ "
            value={item.actualAmount + Number(localAdjustment)}
            thousandSeparator
            decimalScale={2}
          />
        </Text>
      </Table.Td>
    </Table.Tr>
  )
}
