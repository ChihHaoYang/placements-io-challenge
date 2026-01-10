import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconDashboard, IconList } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { URLS } from '../../routes'

export default function Layout() {
  const [opened, { toggle }] = useDisclosure()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: IconDashboard, path: URLS.DASHBOARD },
    { label: 'Campaigns', icon: IconList, path: URLS.CAMPAIGN_LIST }
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3} c="blue">
            Placements.io
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={<item.icon size="1rem" stroke="1.5" />}
            active={
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            }
            onClick={() => {
              navigate(item.path)
              toggle()
            }}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
