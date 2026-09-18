import { ImageResponse } from "next/og"
import { AppIconGlyph } from "@/lib/appIcon"

export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(<AppIconGlyph fontSize={100} />, size)
}
