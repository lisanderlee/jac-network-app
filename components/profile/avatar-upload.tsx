"use client"

import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AVATAR_ACCEPT_MIME, AVATAR_BUCKET, AVATAR_MAX_BYTES, avatarPathFromPublicUrl } from "@/lib/storage/avatar"
import { useBrowserSupabaseClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg"
  if (mime === "image/png") return "png"
  if (mime === "image/webp") return "webp"
  if (mime === "image/gif") return "gif"
  return "img"
}

export function AvatarUpload({
  userId,
  value,
  onUrlChange,
  disabled,
}: {
  userId: string
  value: string
  onUrlChange: (url: string) => void
  disabled?: boolean
}) {
  const supabase = useBrowserSupabaseClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const previewSrc = value.trim() || null

  async function removePhoto() {
    setUploadError(null)
    if (!supabase) {
      onUrlChange("")
      return
    }
    const path = value.trim() ? avatarPathFromPublicUrl(value) : null
    if (path) {
      setUploading(true)
      try {
        await supabase.storage.from(AVATAR_BUCKET).remove([path])
      } finally {
        setUploading(false)
      }
    }
    onUrlChange("")
  }

  async function handleFile(file: File | undefined) {
    if (!file || !supabase) return
    setUploadError(null)

    if (!AVATAR_ACCEPT_MIME.includes(file.type as (typeof AVATAR_ACCEPT_MIME)[number])) {
      setUploadError("Use a JPEG, PNG, WebP, or GIF image.")
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setUploadError("Image must be 2 MB or smaller.")
      return
    }

    setUploading(true)
    try {
      const ext = extFromMime(file.type)
      const path = `${userId}/${crypto.randomUUID()}.${ext}`

      const oldPath = value ? avatarPathFromPublicUrl(value) : null
      if (oldPath) {
        await supabase.storage.from(AVATAR_BUCKET).remove([oldPath])
      }

      const { error: upErr } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

      if (upErr) {
        setUploadError(upErr.message)
        return
      }

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
      onUrlChange(data.publicUrl)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="grid gap-3">
      <Label>Photo</Label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "bg-muted text-muted-foreground flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border text-lg font-semibold",
            !previewSrc && "border-dashed"
          )}
        >
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xs">No photo</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              ref={inputRef}
              type="file"
              accept={AVATAR_ACCEPT_MIME.join(",")}
              className="max-w-xs cursor-pointer text-sm file:mr-2 file:cursor-pointer"
              disabled={disabled || uploading || !supabase}
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            {uploading ? (
              <span className="text-muted-foreground text-sm">Uploading…</span>
            ) : null}
            {!supabase ? (
              <span className="text-muted-foreground text-sm">Loading…</span>
            ) : null}
          </div>
          <p className="text-muted-foreground text-xs">JPEG, PNG, WebP, or GIF · max 2 MB</p>
          {previewSrc ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-auto self-start px-0 text-xs"
              disabled={disabled || uploading}
              onClick={() => void removePhoto()}
            >
              Remove photo
            </Button>
          ) : null}
          {uploadError ? (
            <p className="text-destructive text-sm" role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="avatar_url" className="text-muted-foreground font-normal">
          Or paste image URL
        </Label>
        <Input
          id="avatar_url"
          type="url"
          placeholder="https://…"
          value={value}
          onChange={(e) => onUrlChange(e.target.value)}
          disabled={disabled || uploading}
        />
      </div>
    </div>
  )
}
