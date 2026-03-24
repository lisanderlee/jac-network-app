import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Base URL for links in emails (invites, digests). Avoids `localhost` in production
 * when `NEXT_PUBLIC_APP_URL` was not set — on Vercel, `VERCEL_URL` is set automatically.
 */
export function getAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, "")
  }
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/\/$/, "")
    return host.startsWith("http") ? host : `https://${host}`
  }
  return "http://localhost:3000"
}
