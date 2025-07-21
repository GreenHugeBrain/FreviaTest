'use client'
import Link from 'next/link'
import styles from './Header.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        // Get user data from localStorage when component mounts
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        
        // Close mobile menu when clicking outside
        const handleClickOutside = (event) => {
            if (isMenuOpen && !event.target.closest(`.${styles.nav}`)) {
                setIsMenuOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logoLink}>
                        <img src='/logo.png' alt="შრომა" className={styles.logo} />
                    </Link>
                    
                    <div className={styles.mobileMenuButton} onClick={toggleMenu}>
                        <span className={styles.menuIcon}></span>
                        <span className={styles.menuIcon}></span>
                        <span className={styles.menuIcon}></span>
                    </div>
                    
                    <div className={`${styles.navContainer} ${isMenuOpen ? styles.navContainerOpen : ''}`}>
                        <ul className={styles.navList}>
                            <li className={styles.navItem}>
                                <Link href='/pages/Payment' className={styles.navLink}>გადარიცხვა</Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href='/pages/Hire' className={styles.navLink}>დაქირავება</Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href='' className={styles.navLink}>როგორ მუშაობს</Link>
                            </li>
                        </ul>
                        
                        <div className={styles.authContainer}>
                            {!user ? (
                                <div className={styles.authButtons}>
                                    <Link href="/pages/SignIn">
                                        <button className={styles.signInButton}>შესვლა</button>
                                    </Link>
                                    <Link href="/pages/SignUp">
                                        <button className={styles.signUpButton}>რეგისტრაცია</button>
                                    </Link>
                                </div>
                            ) : (
                                <div 
                                    className={styles.userProfile}
                                    onMouseEnter={() => setIsDropdownOpen(true)}
                                    onMouseLeave={() => setIsDropdownOpen(false)}
                                >
                                    <div className={styles.avatarContainer}>
                                        <img src="/Vector.png" alt="პროფილი" className={styles.avatar} />
                                    </div>
                                    
                                    <div className={`${styles.dropdown} ${isDropdownOpen ? styles.dropdownVisible : ''}`}>
                                        <div className={styles.dropdownArrow}></div>
                                        <Link href={`/pages/profile/${user.username}`} className={styles.dropdownItem}>
                                            <span className={styles.username}>{user.username}</span>
                                            <span className={styles.viewProfile}>პროფილის ნახვა</span>
                                        </Link>
                                        <button onClick={handleLogout} className={styles.dropdownItem}>
                                            <span className={styles.logoutText}>გასვლა</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}