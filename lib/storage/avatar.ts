export const AVATAR_BUCKET = "avatars"

/** Max file size aligned with bucket `file_size_limit` (2 MiB). */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

export const AVATAR_ACCEPT_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const

/**
 * Extract storage object path from a Supabase public object URL, or null if not our bucket.
 */
export function avatarPathFromPublicUrl(publicUrl: string, bucketId: string = AVATAR_BUCKET): string | null {
  const marker = `/object/public/${bucketId}/`
  const i = publicUrl.indexOf(marker)
  if (i === -1) return null
  return decodeURIComponent(publicUrl.slice(i + marker.length).split("?")[0] ?? "")
}
