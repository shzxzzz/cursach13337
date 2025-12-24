import { useNavigate } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import AuthButtons from './AuthButtons.jsx';

const NavLink = ({ children, onClick }) => {
    return (
        <b
            style={{
                fontSize: '16px',
                fontWeight: '400',
                transition: 'all 0.3s ease-in-out',
                color: '#263140',
                textDecoration: 'inherit',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.target.style.color = '#2487ff';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.filter = 'drop-shadow(0px 0px 20px #4824ff)';
            }}
            onMouseLeave={(e) => {
                e.target.style.color = '#263140';
                e.target.style.transform = 'scale(1)';
                e.target.style.filter = 'none';
            }}
        >
            {children}
        </b>
    );
};

const Header = ({ isHeaderScrolled, user, scrollToTop, scrollToSection, handleCabinetClick, handleLogout, setIsAuthModalOpen }) => {
    return (
        <header style={{
            display: 'flex',
            height: '100px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5%',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: isHeaderScrolled ? 'rgba(255, 255, 255, 0.95)' : '#fff',
            backdropFilter: isHeaderScrolled ? 'blur(10px)' : 'none',
            borderBottom: isHeaderScrolled ? '1px solid #e9ecef' : 'none',
            zIndex: 1000,
            transition: 'all 0.3s ease-in-out',
            boxShadow: isHeaderScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
            {     }
            <div
                style={{
                    content: 'url(../../public/Platform.png)',
                    height: '40px',
                    width: 'auto',
                    transition: 'transform 0.3s ease-in-out, filter 0.3s ease-out',
                    cursor: 'pointer'
                }}
                onClick={scrollToTop}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.filter = 'drop-shadow(1px 1px 35px #263140)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'none';
                }}
            />

            {     }
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
            }}>
                <NavLink onClick={() => scrollToSection('courses-section')}>Курсы</NavLink>
                <NavLink onClick={() => scrollToSection('benefits-section')}>О нас</NavLink>
                <NavLink onClick={() => scrollToSection('footer-section')}>Контакты</NavLink>
            </nav>

            {     }
            <AuthButtons
                user={user}
                handleCabinetClick={handleCabinetClick}
                handleLogout={handleLogout}
                setIsAuthModalOpen={setIsAuthModalOpen}
            />
        </header>
    );
};

export default Header;