import {
  Badge,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  NumberFormatter,
  NumberInput,
  Pagination,
  Paper,
  Select,
  Table,
  Text,
  Title
} from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { IconCheck, IconLoader2 } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { AnimatedNumber } from '../components/AnimatedNumber'
import { useCampaignDetail } from '../hooks'
import type { LineItem } from '../types'

export default function CampaignDetail() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: campaign, isLoading, updateLineItem, isFetching } = useCampaignDetail(id || '')
  const animatedNumberStyle = useMemo(
    () => ({
      fontSize: '2rem',
      lineHeight: 1.5
    }),
    []
  )

  if (isLoading) return <LoadingOverlay visible />
  if (!campaign) return <Text>Campaign not found</Text>

  return (
    <Container fluid maw="100%" mx="auto" px="lg" py="md">
      <Group justify="space-between" mb="md">
        <Button variant="subtle" onClick={() => navigate('/campaigns')}>
          &larr; Back to Campaigns
        </Button>
        {isFetching ? (
          <Badge
            color="gray"
            variant="light"
            leftSection={<IconLoader2 size={12} className="mantine-rotate" />}
          >
            Saving & Recalculating...
          </Badge>
        ) : (
          <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
            All changes saved
          </Badge>
        )}
      </Group>

      <Paper p="lg" radius="md" withBorder mb="lg" bg="gray.0">
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Title order={2}>{campaign.name}</Title>
            <Text c="dimmed" size="lg">
              {campaign.advertiser}
            </Text>
          </Grid.Col>
          <Grid.Col span={4} style={{ textAlign: 'right' }}>
            <Text size="sm" c="dimmed">
              Total Actual Spend (Billable)
            </Text>
            <Title order={1} c="blue" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <AnimatedNumber
                value={campaign.actualSpend}
                compact
                prefix="$ "
                c="blue"
                fw={900}
                style={animatedNumberStyle}
              />
            </Title>
            <Text size="xs" c="dimmed">
              Booked:{' '}
              <NumberFormatter
                prefix="$ "
                value={campaign.budget}
                thousandSeparator
                decimalScale={0}
              />
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper p="md" shadow="xs" radius="md">
        <Title order={4} mb="md">
          Invoice Line Items
        </Title>

        <Table.ScrollContainer maxHeight="50dvh" minWidth={500}>
          <Table verticalSpacing="sm" layout="fixed" stickyHeader stickyHeaderOffset={0}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="35%">Item Name</Table.Th>
                <Table.Th w="15%" style={{ textAlign: 'right' }}>
                  Booked
                </Table.Th>
                <Table.Th w="15%" style={{ textAlign: 'right' }}>
                  Actual
                </Table.Th>
                <Table.Th w="20%" style={{ textAlign: 'right' }}>
                  Adjustments
                </Table.Th>
                <Table.Th w="15%" style={{ textAlign: 'right' }}>
                  Total Billable
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {campaign.lineItems.slice((page - 1) * pageSize, page * pageSize).map((item) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  onUpdate={(lineItemId, val) =>
                    updateLineItem({ id: lineItemId, adjustments: val })
                  }
                />
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Group justify="flex-end" mt="md">
          <Select
            value={pageSize.toString()}
            onChange={(v) => {
              if (v) {
                setPage(1)
                setPageSize(Number(v))
              }
            }}
            data={['10', '20', '50', '100']}
            w={80}
            allowDeselect={false}
          />
          <Pagination
            total={Math.ceil(campaign.lineItems.length / pageSize)}
            value={page}
            onChange={(newPage) => setPage(newPage)}
            color="blue"
          />
        </Group>
      </Paper>
    </Container>
  )
}

interface LineItemRowProps {
  item: LineItem
  onUpdate: (id: number, val: number) => void
}

function LineItemRow({ item, onUpdate }: LineItemRowProps) {
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
      <Table.Td style={{ textAlign: 'right' }}>
        <NumberFormatter prefix="$ " value={item.bookedAmount} thousandSeparator decimalScale={2} />
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        <NumberFormatter prefix="$ " value={item.actualAmount} thousandSeparator decimalScale={2} />
      </Table.Td>
      <Table.Td>
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
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
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
