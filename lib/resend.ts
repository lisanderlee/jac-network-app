import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export function getAppOrigin(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
}
