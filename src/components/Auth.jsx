// components/Auth.jsx
import { useState, useEffect } from 'react';
import { Icon } from './Icons.jsx';

const Auth = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Добавляем CSS анимации при монтировании компонента
    useEffect(() => {
        // Проверяем, есть ли уже стили
        if (!document.getElementById('auth-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-modal-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        return () => {
            // Очищаем стили если компонент больше не используется
            const style = document.getElementById('auth-modal-styles');
            if (style && document.querySelectorAll('[id^="auth-modal-styles"]').length <= 1) {
                style.remove();
            }
        };
    }, []);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

            let payload;
            if (isLogin) {
                payload = { email: formData.email, password: formData.password };
            } else {
                // Преобразуем camelCase в snake_case для бэкенда
                payload = {
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName
                };
            }

            console.log('Sending payload:', payload); // Для отладки

            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка авторизации');
            }

            // Сохраняем токен и данные пользователя
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            onLoginSuccess(data.user);
            onClose();

        } catch (err) {
            setError(err.message);
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: ''
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                animation: 'slideIn 0.3s ease-out'
            }}>
                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#627084',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#263140'}
                    onMouseLeave={(e) => e.target.style.color = '#627084'}
                >
                    ×
                </button>

                {/* Иконка */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#1a79ff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <Icon name="user" size={28} color="#fff" />
                    </div>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#263140',
                        marginBottom: '8px'
                    }}>
                        {isLogin ? 'Вход' : 'Регистрация'}
                    </h2>
                    <p style={{
                        color: '#627084',
                        fontSize: '16px'
                    }}>
                        {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
                    </p>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    {!isLogin && (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '20px',
                                width: '100%'
                            }}>
                                <div style={{ width: '100%' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        color: '#263140',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>
                                        Имя
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            padding: '14px 16px',
                                            border: '1px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            transition: 'all 0.3s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1a79ff'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                </div>
                                <div style={{ width: '100%' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        color: '#263140',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>
                                        Фамилия
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            padding: '14px 16px',
                                            border: '1px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            transition: 'all 0.3s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1a79ff'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '20px', width: '100%' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#263140',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '14px 16px',
                                border: '1px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#1a79ff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>

                    <div style={{ marginBottom: '25px', width: '100%' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#263140',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Пароль
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '14px 16px',
                                border: '1px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#1a79ff'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: '#fff5f5',
                            border: '1px solid #ff6b6b',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            width: '100%'
                        }}>
                            <p style={{
                                color: '#d32f2f',
                                margin: 0,
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <Icon name="warning" size={16} color="#d32f2f" />
                                {error}
                            </p>
                        </div>
                    )}

                    <div style={{ width: '100%' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '16px',
                                backgroundColor: '#1a79ff',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = '#1565d8';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 20px rgba(26, 121, 255, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = '#1a79ff';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid #fff',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Загрузка...
                                </>
                            ) : (
                                <>
                                    <Icon name={isLogin ? "login" : "user"} size={18} color="#fff" />
                                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Ссылка на переключение */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '25px',
                    paddingTop: '25px',
                    borderTop: '1px solid #e9ecef',
                    width: '100%'
                }}>
                    <p style={{
                        color: '#627084',
                        fontSize: '14px'
                    }}>
                        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                        <button
                            onClick={switchMode}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#1a79ff',
                                marginLeft: '5px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                padding: '0'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#1565d8';
                                e.target.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#1a79ff';
                                e.target.style.textDecoration = 'none';
                            }}
                        >
                            {isLogin ? 'Зарегистрироваться' : 'Войти'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;