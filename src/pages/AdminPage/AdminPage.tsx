import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { storage, db } from '../../firebaseConfig'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import './AdminPage.css'

interface Category {
    id: string
    name: string
}

const AdminPage = () => {
    const navigate = useNavigate()

    const [product, setProduct] = useState({
        name: '',
        description: '',
        stock: 0,
        price: 0,
        stripePriceId: '',
        category: '',
        image: null as File | null,
    })
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCol = collection(db, 'categories')
            const snapshot = await getDocs(categoriesCol)
            const categoriesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Category[]

            // Create a unique set of categories based on their names
            const uniqueCategories = Array.from(
                new Set(categoriesData.map((cat) => cat.name))
            ).map((name) => {
                return (
                    categoriesData.find((cat) => cat.name === name) ||
                    categoriesData[0]
                )
            })

            setCategories(uniqueCategories)
        }

        fetchCategories()
    }, [])

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProduct({ ...product, image: e.target.files[0] })
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const {
            name,
            description,
            stock,
            price,
            stripePriceId,
            category,
            image,
        } = product

        if (!image) {
            alert('Please upload an image')
            return
        }

        try {
            const storageRef = ref(storage, `products/${image.name}`)
            await uploadBytes(storageRef, image)
            const imageUrl = await getDownloadURL(storageRef)

            const productsCol = collection(db, 'products')
            await addDoc(productsCol, {
                name,
                description,
                stock,
                price,
                stripePriceId,
                category,
                imageUrl,
            })

            setProduct({
                name: '',
                description: '',
                stock: 0,
                price: 0,
                stripePriceId: '',
                category: '',
                image: null,
            })
            alert('Product added successfully')
            navigate('/')
        } catch (error) {
            console.error('Error adding product: ', error)
            alert('Error adding product')
        }
    }
    return (
        <div className="admin-container">
            <h1>Admin Page</h1>
            <form onSubmit={handleSubmit} className="product-form">
                <label>
                    Product Name:
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        name="description"
                        placeholder="Enter product description"
                        value={product.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Stock:
                    <input
                        type="number"
                        name="stock"
                        placeholder="Enter stock quantity"
                        value={product.stock}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        value={product.price}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Stripe Price ID:
                    <input
                        type="text"
                        name="stripePriceId"
                        placeholder="Enter Stripe Price ID"
                        value={product.stripePriceId}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Category:
                    <select
                        name="category"
                        onChange={handleChange}
                        value={product.category}
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Product Image:
                    <input type="file" onChange={handleImageChange} />
                </label>

                <button type="submit">Add Product</button>
            </form>
        </div>
    )
}

export default AdminPage
