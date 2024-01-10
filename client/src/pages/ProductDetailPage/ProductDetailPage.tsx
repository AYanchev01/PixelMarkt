import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../../firebaseConfig'
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { useAuth } from '../../contexts/AuthContext'
import './ProductDetailPage.css'

const ProductDetailPage = () => {
    const { productId } = useParams<{ productId: string }>()
    const [product, setProduct] = useState<any>(null) // TODO: Define a proper type for product
    const [quantity, setQuantity] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProduct = async () => {
            const productRef = doc(db, 'products', productId ?? '')
            const productDoc = await getDoc(productRef)

            if (productDoc.exists()) {
                setProduct({ id: productDoc.id, ...productDoc.data() })
                setLoading(false)
            } else {
                console.log('No such product!')
                setLoading(false)
            }
        }

        if (productId) {
            fetchProduct()
        }
    }, [productId])

    const handleAddToCart = async () => {
        if (!currentUser) {
            alert('Please login to add items to the cart')
            return
        }

        // Check if enough items are in stock
        if (quantity > product.stock) {
            alert(`Sorry, only ${product.stock} items left in stock.`)
            return
        }

        try {
            const cartRef = doc(db, 'carts', currentUser.uid)
            const cartSnap = await getDoc(cartRef)

            if (cartSnap.exists()) {
                const cartData = cartSnap.data()
                let itemInCart = cartData.items.find(
                    (item: { productId: any }) => item.productId === product.id
                )
                let updatedItems = []

                if (itemInCart) {
                    const newQuantity = itemInCart.quantity + quantity
                    if (newQuantity > product.stock) {
                        alert(
                            `Sorry, adding this quantity will exceed stock. Only ${
                                product.stock - itemInCart.quantity
                            } more available.`
                        )
                        return
                    }

                    updatedItems = cartData.items.map(
                        (item: { productId: any }) =>
                            item.productId === product.id
                                ? { ...item, quantity: newQuantity }
                                : item
                    )
                } else {
                    updatedItems = [
                        ...cartData.items,
                        { productId: product.id, quantity },
                    ]
                }

                await updateDoc(cartRef, { items: updatedItems })
            } else {
                await setDoc(cartRef, {
                    userId: currentUser.uid,
                    items: [{ productId: product.id, quantity }],
                })
            }
            alert('Product added to cart')
        } catch (error) {
            console.error('Error adding to cart:', error)
            alert('Error adding to cart')
        }
    }

    const handleCheckout = async () => {
        await handleAddToCart()
        navigate('/cart')
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="product-detail-container">
            <div className="product-image">
                {product && <img src={product.image} alt={product.name} />}
            </div>
            <div className="product-info">
                {product && (
                    <>
                        <h2>{product.name}</h2>
                        <p>${product.price}</p>
                        <p>{product.description}</p>
                        <div className="quantity-selector">
                            <label htmlFor="quantity">Quantity: </label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(parseInt(e.target.value))
                                }
                                min="1"
                                max={product.stock || 10}
                            />
                        </div>
                        <button onClick={handleAddToCart} className="button">
                            Add to Cart
                        </button>
                        <button onClick={handleCheckout} className="button">
                            Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProductDetailPage
