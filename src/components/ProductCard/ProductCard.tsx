import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductCard.css'

interface ProductCardProps {
    product: {
        id: string
        name: string
        price: number
        imageUrl: string
    }
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/product/${product.id}`) // Navigate to Product Detail Page
    }

    return (
        <div className="product-card" onClick={handleClick}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
        </div>
    )
}

export default ProductCard
