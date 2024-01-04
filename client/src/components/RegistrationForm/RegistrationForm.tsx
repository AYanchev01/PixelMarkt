import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface RegistrationFormProps {
    onRegistrationSuccess: () => void
    onAlert: (message: string) => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
    onRegistrationSuccess,
    onAlert,
}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                isAdmin: false
            });

            onRegistrationSuccess();
        } catch (error) {
            if (error instanceof Error) onAlert(error.message);
        }
    };

    return (
        <div className="login-form">
            <h2 className="register-heading">Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
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
                    Register
                </button>
            </form>
        </div>
    )
}

export default RegistrationForm
