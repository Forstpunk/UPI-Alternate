import { ImageResponse } from "next/og"
import { AppIconGlyph } from "@/lib/appIcon"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(<AppIconGlyph fontSize={110} />, {
    width: 192,
    height: 192,
  })
}
