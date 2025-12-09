import React, { useState } from "react";
import {
    LayoutDashboard,
    RefreshCw,
    Activity,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import AlLogo from '../assets/img/logo.png';

function Header({ activeTab = 'home' }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Add your logout logic here
            window.location.href = '/login';
        }
    };

    const navLinks = [
        {
            id: 'home',
            label: 'Home',
            icon: LayoutDashboard,
            href: 'http://localhost:5173/AssemblyHead/Home'
        },
        {
            id: 'summary',
            label: 'Summary',
            icon: Activity,
            href: 'http://localhost:5173/AssemblyHead/Summary'
        },
        {
            id: 'rework',
            label: 'Rework',
            icon: RefreshCw,
            href: 'http://localhost:5173/AssemblyHead/Rework'
        },
        {
            id: 'workplan',
            label: 'Workplan',
            icon: Calendar,
            href: 'http://localhost:5173/AssemblyHead/WorkPlan'
        }
    ];

    return (
        <>
            <header style={{
                background: 'white',
                borderBottom: '1px solid #e5e7eb',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    maxWidth: '1920px',
                    margin: '0 auto',
                    padding: '0 1.5rem'
                }}>
                    {/* Top Bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '70px',
                        gap: '2rem'
                    }}>
                        {/* Logo Section */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flex: '0 0 auto'
                        }}>
                            <img 
                                src={AlLogo} 
                                alt="Logo" 
                                style={{ 
                                    height: '45px',
                                    width: 'auto'
                                }} 
                            />
                            <div style={{
                                borderLeft: '2px solid #e5e7eb',
                                paddingLeft: '1rem',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <h1 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#1f2937',
                                    margin: 0,
                                    lineHeight: '1.2'
                                }}>
                                    Assembly Head Dashboard
                                </h1>
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                    fontWeight: '500'
                                }}>
                                    RearFrame Assembly
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flex: '1 1 auto',
                            justifyContent: 'center'
                        }} className="desktop-nav">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = activeTab === link.id;
                                
                                return (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1.25rem',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            fontWeight: '600',
                                            color: isActive ? '#3b82f6' : '#4b5563',
                                            background: isActive ? '#eff6ff' : 'transparent',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = '#f9fafb';
                                                e.currentTarget.style.color = '#1f2937';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#4b5563';
                                            }
                                        }}
                                    >
                                        <Icon size={18} />
                                        <span>{link.label}</span>
                                    </a>
                                );
                            })}
                        </nav>

                        {/* Right Actions */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            flex: '0 0 auto'
                        }} className="desktop-actions">
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1rem',
                                    background: 'transparent',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    color: '#4b5563',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <Settings size={18} />
                                <span>Settings</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1rem',
                                    background: '#ef4444',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#dc2626';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#ef4444';
                                }}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{
                                display: 'none',
                                padding: '0.5rem',
                                background: 'transparent',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                color: '#4b5563',
                                cursor: 'pointer'
                            }}
                            className="mobile-menu-btn"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div style={{
                            borderTop: '1px solid #e5e7eb',
                            padding: '1rem 0',
                            display: 'none'
                        }} className="mobile-menu">
                            <nav style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = activeTab === link.id;
                                    
                                    return (
                                        <a
                                            key={link.id}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: isActive ? '#3b82f6' : '#4b5563',
                                                background: isActive ? '#eff6ff' : 'transparent',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <Icon size={20} />
                                            <span>{link.label}</span>
                                        </a>
                                    );
                                })}

                                <div style={{
                                    height: '1px',
                                    background: '#e5e7eb',
                                    margin: '0.5rem 0'
                                }} />

                                <button
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#4b5563',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}
                                >
                                    <Settings size={20} />
                                    <span>Settings</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        background: '#ef4444',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Add responsive styles */}
            <style>{`
                @media (max-width: 1024px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    
                    .desktop-actions {
                        display: none !important;
                    }
                    
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    
                    .mobile-menu {
                        display: block !important;
                    }
                }

                @media (max-width: 768px) {
                    header h1 {
                        font-size: 1rem !important;
                    }
                    
                    header span {
                        font-size: 0.75rem !important;
                    }
                }
            `}</style>
        </>
    );
}

export default Header;