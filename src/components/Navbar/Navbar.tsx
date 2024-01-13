import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebaseConfig'
import { signOut } from 'firebase/auth'
import './Navbar.css'

interface NavbarProps {
    isAuthenticated: boolean
    isAdmin: boolean
    onSearchChange: (searchTerm: string) => void
}

const Navbar: React.FC<NavbarProps> = ({
    isAuthenticated,
    isAdmin,
    onSearchChange,
}) => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const userConfirmation = window.confirm(
                'Are you sure you want to log out?'
            )
            if (!userConfirmation) return

            await signOut(auth)
            // Optionally, handle any post-logout logic here
            navigate('/login')
        } catch (error) {
            // Handle any errors during logout
            console.error('Logout failed:', error)
        }
    }

    return (
        <nav className="navbar">
            <span className="website-name">
                <Link to="/" className="home-link">
                    Pixel Markt
                </Link>
            </span>
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search products..."
                className="navbar-search-bar"
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="button-container">
                {isAuthenticated ? (
                    <>
                        {isAdmin && (
                            <Link to="/admin" className="nav-link">
                                Admin
                            </Link>
                        )}
                        <Link to="/cart" className="nav-link">
                            Cart
                        </Link>
                        <Link to="/profile" className="nav-link">
                            Profile
                        </Link>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar
