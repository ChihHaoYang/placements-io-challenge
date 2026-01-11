import { Center, LoadingOverlay, NumberFormatter, Text, Timeline } from '@mantine/core'
import { IconClock, IconGitCommit } from '@tabler/icons-react'

import { useLineItemEditHistory } from '../../hooks/useLineItemEditHistory'

interface HistoryModalProps {
  lineItemId: number | null
}

export function HistoryModal({ lineItemId }: HistoryModalProps) {
  const { data: history, isLoading } = useLineItemEditHistory(lineItemId)

  return (
    <div style={{ position: 'relative', minHeight: 100 }}>
      <LoadingOverlay visible={isLoading} />

      {!isLoading && history?.length === 0 && (
        <Center p="xl">
          <Text c="dimmed">No changes recorded yet.</Text>
        </Center>
      )}

      <Timeline active={0} bulletSize={24} lineWidth={2}>
        {history?.map((record) => (
          <Timeline.Item
            key={record.id}
            bullet={<IconGitCommit size={12} />}
            title={new Date(record.createdAt).toLocaleString()}
          >
            <Text c="dimmed" size="sm">
              Changed from{' '}
              <Text span fw={700} c="red">
                <NumberFormatter
                  prefix="$ "
                  value={record.oldValue}
                  thousandSeparator
                  decimalScale={2}
                />
              </Text>{' '}
              to{' '}
              <Text span fw={700} c="teal">
                <NumberFormatter
                  prefix="$ "
                  value={record.newValue}
                  thousandSeparator
                  decimalScale={2}
                />
              </Text>
            </Text>
          </Timeline.Item>
        ))}
        <Timeline.Item bullet={<IconClock size={12} />} title="Created">
          <Text c="dimmed" size="sm">
            Item created
          </Text>
        </Timeline.Item>
      </Timeline>
    </div>
  )
}
