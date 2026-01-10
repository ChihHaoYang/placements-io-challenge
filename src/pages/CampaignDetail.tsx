import { Button, Container, Text, Title } from '@mantine/core'
import { useNavigate, useParams } from 'react-router'

import { URLS } from '../routes'

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <Container>
      <Button variant="subtle" onClick={() => navigate(URLS.CAMPAIGN_LIST)}>
        &larr; Back to List
      </Button>
      <Title mt="md">Campaign Detail: {id}</Title>
      <Text>Details placeholder</Text>
    </Container>
  )
}
