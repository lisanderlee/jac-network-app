import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface InviteEmailProps {
  name: string
  inviteUrl: string
}

export function InviteEmail({ name, inviteUrl }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You are invited to join the network</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You are invited</Heading>
          <Section>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Your application was approved. Click the button below to create your account and
              complete your profile.
            </Text>
            <Section style={btnSection}>
              <Button href={inviteUrl} style={button}>
                Accept invitation
              </Button>
            </Section>
            <Text style={muted}>
              This link expires in 24 hours. If you did not apply, you can ignore this email.
            </Text>
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

const btnSection = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#111827",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
}

const muted = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "24px 0 0",
}

export default InviteEmail
