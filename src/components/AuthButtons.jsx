import { useNavigate } from 'react-router-dom';
import { Icon } from './Icons.jsx';

const AuthButtons = ({ user, handleCabinetClick, handleLogout, setIsAuthModalOpen }) => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', gap: '15px', marginLeft: 'auto' }}>
            {user ? (
                <>
                    <button
                        onClick={() => navigate('/cabinet/')}
                        style={{
                            height: '50px',
                            width: '200px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1px solid #cdcdcd',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            outline: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.border = '1px solid #1a79ff';
                            e.target.style.background = '#1a79ff';
                            e.target.style.color = '#ffffff';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'drop-shadow(1px 1px 15px #1a79ff)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.border = '1px solid #cdcdcd';
                            e.target.style.background = '#ffffff';
                            e.target.style.color = '#263140';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = 'none';
                        }}
                    >
                        <Icon name="user" size={18} />
                        Личный кабинет
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            height: '50px',
                            width: '120px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1px solid #ff6b6b',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            outline: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#ff6b6b'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.border = '1px solid #d32f2f';
                            e.target.style.background = '#ff6b6b';
                            e.target.style.color = '#ffffff';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.border = '1px solid #ff6b6b';
                            e.target.style.background = '#ffffff';
                            e.target.style.color = '#ff6b6b';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        <Icon name="logout" size={18} />
                        Выйти
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        style={{
                            height: '50px',
                            width: '120px',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1px solid #cdcdcd',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            outline: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.border = '1px solid #1a79ff';
                            e.target.style.background = '#ffffff';
                            e.target.style.color = '#1a79ff';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'drop-shadow(1px 1px 15px rgba(26, 121, 255, 0.3))';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.border = '1px solid #cdcdcd';
                            e.target.style.background = '#ffffff';
                            e.target.style.color = '#263140';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = 'none';
                        }}
                    >
                        <Icon name="login" size={18} />
                        Войти
                    </button>

                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        style={{
                            height: '50px',
                            width: '150px',
                            borderRadius: '10px',
                            background: '#1a79ff',
                            border: '1px solid #1a79ff',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            outline: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#ffffff'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#1565d8';
                            e.target.style.border = '1px solid #1565d8';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'drop-shadow(1px 1px 15px #1a79ff)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#1a79ff';
                            e.target.style.border = '1px solid #1a79ff';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = 'none';
                        }}
                    >
                        <Icon name="user" size={18} />
                        Регистрация
                    </button>
                </>
            )}
        </div>
    );
};

export default AuthButtons;