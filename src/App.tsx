import '@mantine/core/styles.css'

import { MantineProvider } from '@mantine/core'

import { theme } from './theme'

function App() {
  return (
    <MantineProvider theme={theme}>
      <div>App</div>
    </MantineProvider>
  )
}

export default App
