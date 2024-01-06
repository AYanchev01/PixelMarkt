import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebaseConfig'

interface CheckoutSessionData {
    paymentMethodId: string
    totalPrice: number // Make sure this is in the smallest currency unit, e.g., cents
    // Any other data the function might need ...
}

interface CheckoutSessionResponse {
    sessionId: string // Assuming the response contains a sessionId
}

// Define the callable function with the correct types for request and response
export const createCheckoutSession = httpsCallable<
    CheckoutSessionData,
    CheckoutSessionResponse
>(functions, 'createCheckoutSession')
