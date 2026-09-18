import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UPI Split",
    short_name: "UPI Split",
    description:
      "A simulated UPI payments app that automatically splits large payments into multiple transactions under a configurable limit.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b3d2e",
    theme_color: "#14532d",
    icons: [
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
