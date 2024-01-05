import React from 'react'
import './ProductCard.css'

interface ProductCardProps {
    product: {
        id: string
        name: string
        price: number
        image: string
    }
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
        </div>
    )
}

export default ProductCard
