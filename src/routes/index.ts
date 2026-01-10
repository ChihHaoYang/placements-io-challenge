import { createHashRouter } from 'react-router'

import Layout from '../components/Layout/Layout'

export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: () => 'Dashboard placeholder' },
      {
        path: 'campaigns',
        Component: () => 'Campaign List placeholder'
      },
      {
        path: 'campaigns/:id',
        Component: () => 'Campaign Detail placeholder'
      },
      {
        path: '*',
        Component: () => '404 Not Found'
      }
    ]
  }
])
