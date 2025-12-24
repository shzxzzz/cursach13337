     
import { useEffect } from 'react';
import { Icon } from './Icons.jsx';

const ErrorModal = ({ error, onClose }) => {
    useEffect(() => {
             
        if (error) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [error]);

    if (!error) return null;

    return (
        <>
            {     }
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 9998,
                    animation: 'fadeIn 0.3s ease',
                    backdropFilter: 'blur(3px)'
                }}
                onClick={onClose}
            />

            {     }
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                animation: 'slideIn 0.3s ease',
                minWidth: '300px',
                maxWidth: '500px',
                width: '90%'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    border: '1px solid #ff6b6b'
                }}>
                    {     }
                    <div style={{
                        width: '70px',
                        height: '70px',
                        backgroundColor: '#ff6b6b',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        animation: 'pulse 2s infinite'
                    }}>
                        <Icon name="warning" size={35} color="#fff" />
                    </div>

                    {     }
                    <h3 style={{
                        color: '#d32f2f',
                        marginBottom: '15px',
                        fontSize: '24px',
                        fontWeight: '700',
                        textAlign: 'center'
                    }}>
                        Ошибка
                    </h3>

                    {     }
                    <div style={{
                        color: '#263140',
                        marginBottom: '25px',
                        fontSize: '16px',
                        lineHeight: '1.5',
                        textAlign: 'center',
                        padding: '0 10px'
                    }}>
                        {typeof error === 'string' ? error : error.message || 'Произошла ошибка'}
                    </div>

                    {     }
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 35px',
                                backgroundColor: '#1a79ff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                minWidth: '150px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1565d8';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(26, 121, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#1a79ff';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
        </>
    );
};

export default ErrorModal;