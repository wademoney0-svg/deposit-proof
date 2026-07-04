/**
 * Paste your Stripe Payment Link here to enable the paid PDF export.
 * While this is empty, exporting stays free (the paywall is disabled).
 *
 * In Stripe: create a Payment Link for a one-time price, and set its
 * confirmation behavior to redirect to:
 *   https://wademoney0-svg.github.io/depositcam/?paid=1
 */
export const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/eVq6oB4OAfcm3dXbwzfUQ00'

export const UNLOCK_PRICE = '$4.99'

const UNLOCK_KEY = 'dp_unlocked'

export function paywallEnabled(): boolean {
  return STRIPE_PAYMENT_LINK.length > 0
}

export function isUnlocked(): boolean {
  return localStorage.getItem(UNLOCK_KEY) === '1'
}

export function markUnlocked(): void {
  localStorage.setItem(UNLOCK_KEY, '1')
}

/** Detects the ?paid=1 redirect from Stripe and persists the unlock. */
export function absorbPaymentRedirect(): void {
  const url = new URL(window.location.href)
  if (url.searchParams.get('paid') === '1') {
    markUnlocked()
    url.searchParams.delete('paid')
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  }
}
