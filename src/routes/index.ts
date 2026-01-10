import { createHashRouter } from 'react-router'

import Layout from '../components/Layout/Layout'

export const PAGES = {
  DASHBOARD: 'DASHBOARD',
  CAMPAIGN_LIST: 'CAMPAIGN_LIST',
  CAMPAIGN_DETAIL: 'CAMPAIGN_DETAIL'
} as const

export const URLS: Record<(typeof PAGES)[keyof typeof PAGES], string> = {
  DASHBOARD: '/',
  CAMPAIGN_LIST: '/campaigns',
  CAMPAIGN_DETAIL: '/campaigns/:id'
}

export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: () => 'Dashboard placeholder' },
      {
        path: URLS.CAMPAIGN_LIST,
        Component: () => 'Campaign List placeholder'
      },
      {
        path: URLS.CAMPAIGN_DETAIL,
        Component: () => 'Campaign Detail placeholder'
      },
      {
        path: '*',
        Component: () => '404 Not Found'
      }
    ]
  }
])
