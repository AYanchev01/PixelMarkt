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
    updateDoc,
    Unsubscribe,
} from 'firebase/firestore'
import { useAuth } from '../../contexts/AuthContext'
import './CartPage.css'
import { useStripe, useElements } from '@stripe/react-stripe-js'

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
    const stripe = useStripe()
    const elements = useElements()

    const handleRemoveFromCart = async (productIdToRemove: string) => {
        if (!currentUser) {
            console.error('User is not authenticated.')
            return
        }

        try {
            const cartRef = doc(db, 'carts', currentUser.uid)
            const cartSnap = await getDoc(cartRef)

            if (cartSnap.exists()) {
                const currentItems = cartSnap.data().items
                const updatedItems = currentItems.filter(
                    (item: { productId: string }) =>
                        item.productId !== productIdToRemove
                )

                await updateDoc(cartRef, { items: updatedItems })

                // Update local state to reflect the change
                setCartItems(
                    cartItems.filter(
                        (item) => item.productId !== productIdToRemove
                    )
                )
                calculateTotalPrice(updatedItems)
            }
        } catch (error) {
            console.error('Error removing item from cart:', error)
            alert('Error removing item from cart')
        }
    }

    // Function to calculate total price
    const calculateTotalPrice = (items: CartItem[]) => {
        const total = items.reduce(
            (acc, item) =>
                acc + (item.productDetails?.price || 0) * item.quantity,
            0
        )
        setTotalPrice(total)
    }

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!currentUser) return // Ensure user is logged in

            const cartRef = doc(db, 'carts', currentUser.uid)
            const cartSnap = await getDoc(cartRef)

            if (cartSnap.exists() && cartSnap.data().items.length > 0) {
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
            } else {
                // Handle the case when the cart is empty
                setCartItems([])
                setTotalPrice(0)
            }
        }

        fetchCartItems()
    }, [currentUser])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!stripe || !elements || !currentUser) {
            console.error(
                'Stripe.js has not loaded yet or user is not authenticated.'
            )
            return
        }

        // Filter out any cart items missing a Stripe Price ID
        const validCartItems = cartItems.filter(
            (item) => item.productDetails?.stripePriceId
        )

        // Define the checkout session data
        const checkoutSessionRef = collection(
            db,
            'users',
            currentUser.uid,
            'checkout_sessions'
        )
        try {
            const docRef = await addDoc(checkoutSessionRef, {
                line_items: validCartItems.map((item) => ({
                    price: item.productDetails!.stripePriceId,
                    quantity: item.quantity,
                })),
                success_url: window.location.origin,
                cancel_url: window.location.origin,
                mode: 'payment',
            })

            // Listening for changes on the created document
            const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
                const sessionData = docSnapshot.data()
                if (sessionData && sessionData.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = sessionData.url

                    // Clear the cart items immediately after creating the checkout session
                    const cartRef = doc(db, 'carts', currentUser.uid)
                    await updateDoc(cartRef, { items: [] })
                    setCartItems([])
                    setTotalPrice(0)

                    unsubscribe()
                } else if (sessionData && sessionData.error) {
                    // Handle errors
                    console.error(
                        'Error in checkout session:',
                        sessionData.error
                    )
                    alert(`Error: ${sessionData.error.message}`)
                    unsubscribe()
                }
            })
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
                        <button
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="remove-from-cart"
                        >
                            Remove from Cart
                        </button>
                    </div>
                ))}
            </div>

            <div className="checkout-form">
                <h2>Checkout</h2>
                <form onSubmit={handleSubmit}>
                    <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                    <button type="submit" disabled={!stripe}>
                        Continue to payment
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CartPage
