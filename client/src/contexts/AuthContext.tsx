import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../firebaseConfig'

interface AuthContextType {
    currentUser: User | null
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setIsAuthenticated(!!user)
        })

        return () => unsubscribe()
    }, [])

    const value = { currentUser, isAuthenticated }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
