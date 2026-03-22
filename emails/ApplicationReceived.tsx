import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ApplicationReceivedProps {
  name: string
}

export function ApplicationReceived({ name }: ApplicationReceivedProps) {
  return (
    <Html>
      <Head />
      <Preview>We received your application</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thanks for applying</Heading>
          <Section>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              We have received your application to join the network. Our team will review it
              shortly. If it is a fit, you will receive an email with an invitation to create your
              account.
            </Text>
            <Text style={footer}>— The team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 24px",
  borderRadius: "8px",
  maxWidth: "480px",
}

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 24px",
}

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
}

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "24px 0 0",
}

export default ApplicationReceived
