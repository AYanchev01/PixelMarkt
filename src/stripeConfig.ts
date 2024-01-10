import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''

export const stripePromise = loadStripe(stripePublishableKey)
