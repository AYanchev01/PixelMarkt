import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
} from 'firebase/firestore'
import { useAuth } from '../../contexts/AuthContext'
import './CartPage.css'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'

interface ProductDetail {
    name: string
    price: number
    image: string
    description: string
    stripePriceId: string
}

interface CartItem {
    productId: string
    quantity: number
    productDetails?: ProductDetail
}

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!currentUser) return // Ensure user is logged in

            const cartRef = doc(db, 'carts', currentUser.uid)
            const cartSnap = await getDoc(cartRef)

            if (cartSnap.exists()) {
                const cartData = cartSnap.data().items
                const productIds = cartData.map(
                    (item: { productId: string }) => item.productId
                )

                // Fetch product details for each item in the cart
                const productsCollection = collection(db, 'products')
                const productsQuery = query(
                    productsCollection,
                    where('__name__', 'in', productIds)
                )
                const productSnapshots = await getDocs(productsQuery)

                const detailedCartItems = cartData.map(
                    (item: { productId: string; quantity: number }) => {
                        const productDoc = productSnapshots.docs.find(
                            (doc) => doc.id === item.productId
                        )
                        return {
                            ...item,
                            productDetails: productDoc
                                ? productDoc.data()
                                : null,
                        }
                    }
                )

                setCartItems(detailedCartItems)

                // Calculate the total price
                const total = detailedCartItems.reduce(
                    (acc: number, item: CartItem) => {
                        return (
                            acc +
                            (item.productDetails?.price || 0) * item.quantity
                        )
                    },
                    0
                )

                setTotalPrice(total)
            }
        }

        fetchCartItems()
    }, [currentUser])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('handleSubmit started') // Debugging log
        if (!stripe || !elements || !currentUser) {
            console.error(
                'Stripe.js has not loaded yet or user is not authenticated.'
            )
            return
        }

        // Define the checkout session data
        const checkoutSession = {
            lineItems: cartItems.map((item) => ({
                price: item.productDetails?.stripePriceId, // Replace with Stripe Price ID
                quantity: item.quantity,
            })),
            successUrl: window.location.origin, // Replace with your success URL
            cancelUrl: window.location.origin, // Replace with your cancel URL
        }

        try {
            const docRef = await addDoc(collection(db, 'checkout_sessions'), {
                uid: currentUser.uid,
                ...checkoutSession,
            })
            console.log('Firestore write operation successful', docRef.id) // Debugging log

            // Wait for the Stripe Extension to update the checkout session document
            const unsubscribe = onSnapshot(
                doc(db, 'checkout_sessions', docRef.id),
                async (docSnapshot) => {
                    console.log('onSnapshot triggered', docSnapshot.data()) // Debugging log
                    const sessionData = docSnapshot.data()
                    if (!sessionData) return
                    console.log('sessionData exists', sessionData) // Debugging log

                    const { error, sessionId } = sessionData
                    if (error) {
                        alert(`Error: ${error}`)
                        return
                    }

                    console.log('Before Redirecting to Stripe Checkout')
                    if (sessionId) {
                        // Redirect to Stripe Checkout
                        console.log('Redirecting to Stripe Checkout')
                        const result = await stripe.redirectToCheckout({
                            sessionId,
                        })
                        if (result.error) {
                            alert(`Error: ${result.error.message}`)
                        } else {
                            alert('Payment successful')
                            navigate('/')
                        }
                        unsubscribe() // Detach the listener
                    }
                }
            )
        } catch (error) {
            console.error('Error creating checkout session:', error)
            alert('Failed to initiate payment.')
        }
    }

    return (
        <div className="cart-page">
            <div className="cart-items">
                <h1>Your Cart</h1>
                {/* Render cart items with additional details */}
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item-container">
                        <div className="cart-item-image">
                            <img
                                src={item.productDetails?.image}
                                alt={item.productDetails?.name}
                            />
                        </div>
                        <div className="cart-item-details">
                            <p>{item.productDetails?.name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.productDetails?.price}</p>
                            {/* Add more product information as needed */}
                        </div>
                    </div>
                ))}
            </div>

            <div className="checkout-form">
                <h2>Checkout</h2>
                <form onSubmit={handleSubmit}>
                    <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                    <div>
                        <label htmlFor="address">Shipping Address:</label>
                        <textarea id="address" required />
                    </div>
                    <div>
                        <label htmlFor="cardDetails">Card Details:</label>
                        <CardElement options={{ hidePostalCode: true }} />
                    </div>
                    <button type="submit" disabled={!stripe}>
                        Pay
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CartPage
