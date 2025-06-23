import React from 'react';
import './TopNavBar.css';
import logo from '../assets/darsa.png';

const TopNavBar = ({ onMobileMenuToggle }) => {
    return (
        <nav className="top-nav-bar">
            <div className="nav-content">
                <button
                    className="mobile-menu-btn"
                    onClick={onMobileMenuToggle}
                    aria-label="Toggle mobile menu"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>

                <div className="nav-logo">
                    <img src={logo} alt="DARSA AI" className="logo-image" />
                </div>
                <div className="nav-actions">
                    <button className="nav-icon-btn toggle-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="5" width="22" height="4" rx="2"/>
                            <rect x="1" y="15" width="22" height="4" rx="2"/>
                        </svg>
                    </button>
                    <button className="nav-icon-btn notification-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        <span className="notification-dot"></span>
                    </button>
                    <button className="nav-icon-btn profile-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default TopNavBar;
