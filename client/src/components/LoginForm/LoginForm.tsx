import React, { useState } from 'react'
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface LoginFormProps {
    onLoginSuccess: () => void
    onAlert: (message: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onAlert }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            onLoginSuccess()
        } catch (error) {
            if (error instanceof Error) onAlert(error.message)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            const user = userCredential.user;

            // Check if a user document exists
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // Create a new user document if it doesn't exist
                await setDoc(userDocRef, {
                    email: user.email,
                    isAdmin: false // Default to false
                });
            }

            onLoginSuccess();
        } catch (error) {
            if (error instanceof Error) onAlert(error.message);
        }
    };

    const handleForgotPassword = async () => {
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email)
                onAlert('Password reset link sent!')
            } catch (error) {
                if (error instanceof Error) onAlert(error.message)
            }
        } else {
            onAlert('Please enter your email address.')
        }
    }

    return (
        <div className="login-form">
            <h2>Sign in</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or Phone"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="sign-in-btn">
                    Sign in
                </button>
            </form>
            <button
                onClick={handleForgotPassword}
                className="forgot-password-btn"
            >
                Forgot password?
            </button>
            <div className="separator">or</div>
            <button onClick={handleGoogleLogin} className="google-login-btn">
                Sign in with Google
            </button>
        </div>
    )
}

export default LoginForm
