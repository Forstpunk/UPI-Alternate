const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("upi-split-theme");
    var isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`

export function ThemeScript() {
  // Runs before paint to avoid a flash of the wrong theme.
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
}
