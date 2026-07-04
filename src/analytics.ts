declare global {
  interface Window {
    goatcounter?: { count?: (opts: { path: string; event: boolean }) => void }
  }
}

/** Fire a named GoatCounter event. No-ops if the script hasn't loaded (or is blocked). */
export function track(name: string): void {
  window.goatcounter?.count?.({ path: name, event: true })
}
