import './App.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage/HomePage'
// import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import LoginPage from './pages/LoginPage/LoginPage'
// import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import { auth } from './firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

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
        <Router>
            <div className="App">
                <Navbar isAuthenticated={isAuthenticated} />
                <div className="content">
                    {' '}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        {/* <Route path="/product/:productId" element={<ProductDetailPage />} /> */}
                        <Route path="/login" element={<LoginPage />} />
                        {/* <Route path="/profile" element={<UserProfilePage />} /> */}
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    )
}

export default App
