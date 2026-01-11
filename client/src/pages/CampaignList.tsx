import {
  Badge,
  Button,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Pagination,
  Paper,
  Select,
  Table,
  Text,
  Title
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconDownload, IconEye } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { useCampaigns } from '../hooks'

export default function CampaignList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('p') || 1)
  const pageSize = Number(searchParams.get('size') || 10)
  const { data: campaigns, isLoading, isError } = useCampaigns(page, Number(pageSize))

  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const res = await fetch('http://localhost:3000/api/export')
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `campaigns_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to export CSV: ${(error as Error).message}`,
        color: 'red'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const updateParams = (newPage: number, newPageSize: number) => {
    setSearchParams({
      p: newPage.toString(),
      size: newPageSize.toString()
    })
  }

  const getBadgeColor = (utilization: number) => {
    if (utilization >= 100) return 'red'
    if (utilization >= 80) return 'yellow'
    return 'green'
  }

  const getUtilization = (actual: number, booked: number) => {
    const utilization = booked === 0 ? 0 : (actual / booked) * 100
    return (
      <Badge color={getBadgeColor(utilization)} variant="light">
        <NumberFormatter value={utilization} decimalScale={2} />%
      </Badge>
    )
  }

  const rows = campaigns?.data.map((campaign) => (
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
      <Table.Td>{getUtilization(campaign.actualSpend, campaign.budget)}</Table.Td>
      <Table.Td ta="right">
        <NumberFormatter prefix="$ " value={campaign.budget} thousandSeparator decimalScale={0} />
      </Table.Td>
      <Table.Td ta="right">
        <NumberFormatter
          prefix="$ "
          value={campaign.actualSpend}
          thousandSeparator
          decimalScale={0}
        />
      </Table.Td>
      <Table.Td ta="right">
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
        <Button
          leftSection={<IconDownload size={16} />}
          onClick={handleExport}
          loading={isExporting}
          variant="outline"
        >
          Export All
        </Button>
      </Group>

      <Table.ScrollContainer maxHeight="60dvh" minWidth={500}>
        <Table
          highlightOnHover
          stickyHeader
          stickyHeaderOffset={0}
          verticalSpacing="sm"
          layout="fixed"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={300}>Name</Table.Th>
              <Table.Th>Advertiser</Table.Th>
              <Table.Th>Utilization</Table.Th>
              <Table.Th ta="right">Booked Budget</Table.Th>
              <Table.Th ta="right">Actual Spend</Table.Th>
              <Table.Th ta="right">Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group justify="flex-end" mt="md">
        <Select
          value={pageSize.toString()}
          onChange={(v) => {
            if (v) {
              updateParams(1, Number(v))
            }
          }}
          data={['10', '20', '50', '100']}
          w={80}
          allowDeselect={false}
        />
        <Pagination
          total={campaigns?.meta.totalPages || 0}
          value={page}
          onChange={(newPage) => updateParams(newPage, pageSize)}
          color="blue"
        />
      </Group>
    </Paper>
  )
}
