import '@mantine/core/styles.css'

import { MantineProvider } from '@mantine/core'
import { RouterProvider } from 'react-router'

import { router } from './routes'
import { theme } from './theme'

function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}

export default App
