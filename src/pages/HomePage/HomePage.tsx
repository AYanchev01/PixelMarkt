import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import ProductCard from '../../components/ProductCard/ProductCard'
import './HomePage.css'

interface Product {
    id: string
    name: string
    price: number
    imageUrl: string
}

interface HomePageProps {
    searchQuery: string
}

const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
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

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return <div>Loading products...</div>
    }

    return (
        <div className="home-page">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

export default HomePage
