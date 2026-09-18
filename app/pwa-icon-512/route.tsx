import { ImageResponse } from "next/og"
import { AppIconGlyph } from "@/lib/appIcon"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(<AppIconGlyph fontSize={290} />, {
    width: 512,
    height: 512,
  })
}
