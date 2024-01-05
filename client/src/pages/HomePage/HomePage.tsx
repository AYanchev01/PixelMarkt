import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import ProductCard from '../../components/ProductCard/ProductCard'
import './HomePage.css'

interface Product {
    id: string
    name: string
    price: number
    image: string
}

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products')
            const productSnapshot = await getDocs(productsCollection)
            const productList = productSnapshot.docs.map((doc) => ({
                ...(doc.data() as Product),
                id: doc.id,
            }))
            setProducts(productList)
            setLoading(false)
        }

        fetchProducts()
    }, [])

    if (loading) {
        return <div>Loading products...</div>
    }

    return (
        <div className="home-page">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

export default HomePage
