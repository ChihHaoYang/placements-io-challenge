import { createHashRouter } from 'react-router'

import Layout from '../components/Layout/Layout'
import CampaignDetail from '../pages/CampaignDetail'
import CampaignList from '../pages/CampaignList'
import Dashboard from '../pages/Dashboard'

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
      { index: true, Component: Dashboard },
      {
        path: URLS.CAMPAIGN_LIST,
        Component: CampaignList
      },
      {
        path: URLS.CAMPAIGN_DETAIL,
        Component: CampaignDetail
      },
      {
        path: '*',
        Component: () => '404 Not Found'
      }
    ]
  }
])
