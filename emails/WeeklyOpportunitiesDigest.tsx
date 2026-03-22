import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export interface WeeklyDigestOpportunity {
  id: string
  title: string
  type: string
}

interface WeeklyOpportunitiesDigestProps {
  opportunities: WeeklyDigestOpportunity[]
  boardUrl: string
}

export function WeeklyOpportunitiesDigest({ opportunities, boardUrl }: WeeklyOpportunitiesDigestProps) {
  const preview =
    opportunities.length === 0
      ? "No new opportunities this week"
      : `${opportunities.length} new listing${opportunities.length === 1 ? "" : "s"} on the board`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Weekly opportunities</Heading>
          <Section>
            {opportunities.length === 0 ? (
              <Text style={text}>No new opportunities were posted in the last 7 days.</Text>
            ) : (
              <>
                <Text style={text}>Here is what members posted in the last week:</Text>
                <Section style={list}>
                  {opportunities.map((o) => (
                    <Text key={o.id} style={item}>
                      <Link href={`${boardUrl.replace(/\/$/, "")}/opportunities/${o.id}`} style={link}>
                        {o.title}
                      </Link>
                      <span style={muted}> · {o.type}</span>
                    </Text>
                  ))}
                </Section>
              </>
            )}
            <Text style={text}>
              <Link href={boardUrl} style={link}>
                Open the opportunity board
              </Link>
            </Text>
            <Text style={footer}>— JAC Network</Text>
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

const list = {
  margin: "0 0 16px",
}

const item = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: "0 0 10px",
}

const link = {
  color: "#2563eb",
  textDecoration: "underline",
}

const muted = {
  color: "#6b7280",
  fontSize: "14px",
}

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "24px 0 0",
}

export default WeeklyOpportunitiesDigest
