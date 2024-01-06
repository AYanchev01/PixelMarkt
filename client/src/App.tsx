import './App.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage/HomePage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import LoginPage from './pages/LoginPage/LoginPage'
// import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import { auth } from './firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { AuthProvider } from './contexts/AuthContext'
import CartPage from './pages/CartPage/CartPage'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from './stripeConfig'

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        })

        return () => unsubscribe()
    }, [])

    return (
        <Elements stripe={stripePromise}>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Navbar isAuthenticated={isAuthenticated} />
                        <div className="content">
                            {' '}
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route
                                    path="/product/:productId"
                                    element={<ProductDetailPage />}
                                />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                {/* <Route path="/profile" element={<UserProfilePage />} /> */}
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </Router>
            </AuthProvider>
        </Elements>
    )
}

export default App
