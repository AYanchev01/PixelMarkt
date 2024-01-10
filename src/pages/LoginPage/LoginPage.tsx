import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../../components/LoginForm/LoginForm'
import './LoginPage.css'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'

const LoginPage = () => {
    const navigate = useNavigate()
    const [alert, setAlert] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)

    const handleLoginSuccess = () => {
        navigate('/')
    }

    const handleAlert = (message: string) => {
        setAlert(message)
        setTimeout(() => setAlert(''), 3000)
    }

    const toggleForm = () => {
        setIsRegistering(!isRegistering)
    }

    return (
        <div className="login-page">
            <div className="login-container">
                {isRegistering ? (
                    <RegistrationForm
                        onRegistrationSuccess={handleLoginSuccess}
                        onAlert={handleAlert}
                    />
                ) : (
                    <LoginForm
                        onLoginSuccess={handleLoginSuccess}
                        onAlert={handleAlert}
                    />
                )}
                <button onClick={toggleForm} className="toggle-register-btn">
                    {isRegistering
                        ? 'Already have an account? Sign In'
                        : 'Need an account? Register'}
                </button>
                {alert && <p className="alert-message">{alert}</p>}
            </div>
        </div>
    )
}

export default LoginPage
