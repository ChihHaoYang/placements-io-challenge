import {
  Badge,
  Button,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Paper,
  ScrollArea,
  Table,
  Text,
  Title
} from '@mantine/core'
import { IconEye } from '@tabler/icons-react'
import { useNavigate } from 'react-router'

import { useCampaigns } from '../hooks/useCampaigns'

export default function CampaignList() {
  const navigate = useNavigate()
  const { data: campaigns, isLoading, isError } = useCampaigns()

  const getBadgeColor = (utilization: number) => {
    if (utilization >= 100) return 'red'
    if (utilization >= 80) return 'yellow'
    return 'green'
  }

  const rows = campaigns?.map((campaign) => (
    <Table.Tr key={campaign.id}>
      <Table.Td title={campaign.name}>
        <Text fw={500} size="sm">
          {campaign.name}
        </Text>
        <Text c="dimmed" size="xs">
          ID: {campaign.id}
        </Text>
      </Table.Td>
      <Table.Td>{campaign.advertiser}</Table.Td>
      <Table.Td>
        <Badge color={getBadgeColor(campaign.utilization)} variant="light">
          <NumberFormatter value={campaign.utilization} decimalScale={2} />%
        </Badge>
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        <NumberFormatter prefix="$ " value={campaign.budget} thousandSeparator decimalScale={0} />
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        <NumberFormatter
          prefix="$ "
          value={campaign.actualSpend}
          thousandSeparator
          decimalScale={0}
        />
      </Table.Td>
      <Table.Td>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconEye size={14} />}
          onClick={() => navigate(campaign.id.toString())}
        >
          View Invoice
        </Button>
      </Table.Td>
    </Table.Tr>
  ))

  if (isError) {
    return (
      <Paper p="md" shadow="xs" radius="md">
        <Text c="red">Failed to load campaigns. Please try again later.</Text>
      </Paper>
    )
  }

  return (
    <Paper p="md" shadow="xs" radius="md" pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />

      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Campaigns</Title>
          <Text c="dimmed" size="sm">
            Manage billing and invoices
          </Text>
        </div>
        <Button>Export All</Button>
      </Group>

      <ScrollArea>
        <Table highlightOnHover verticalSpacing="sm" layout="fixed">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={300}>Name</Table.Th>
              <Table.Th>Advertiser</Table.Th>
              <Table.Th>Utilization</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Booked Budget</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Actual Spend</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  )
}
