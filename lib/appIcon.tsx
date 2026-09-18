export function AppIconGlyph({ fontSize }: { fontSize: number }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(160deg, #0b3d2e 0%, #14532d 55%, #1a6b3c 100%)",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        U
      </span>
    </div>
  )
}
