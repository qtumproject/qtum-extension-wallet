import {
  Box, Text, Container, Divider, Copyable, Button, Image
} from '@metamask/snaps-sdk/jsx';


export const renderDashboard = (params: { qtumAddress?: string; hexAddress?: string }) => (
  <Container>
    <Box>
      <Text fontWeight="bold">Dashboard</Text>
      <Divider/>
      <Box>
        <Text>Your Qtum address:</Text>
        <Copyable value={params.qtumAddress ?? ''}/>
        <Text>Your Qtum address in hexadecimal format:</Text>
        <Copyable value={params.hexAddress ?? ''}/>
      </Box>
      <Divider/>
      <Button name="logout" variant="destructive">Logout</Button>
    </Box>
  </Container>
);
