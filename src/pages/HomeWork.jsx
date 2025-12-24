import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { useHomework } from '../api/hooks/useHomework.js';

const HomeworkPage = () => {
    const navigate = useNavigate();
    const {
        homeworks,
        stats,
        loading,
        error,
        refreshing,
        submitAnswer,
        changeGrade,
        changeStatus,
        refresh
    } = useHomework();

         
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#fff'
            }}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #1a79ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p style={{ color: '#627084', fontSize: '18px' }}>Загрузка домашних заданий...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#fff',
                padding: '20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '500px',
                    padding: '40px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '12px',
                    backgroundColor: '#fff5f5'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ff6b6b',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <Icon name="warning" size={30} color="#fff" />
                    </div>
                    <h3 style={{ color: '#d32f2f', marginBottom: '15px' }}>Ошибка загрузки</h3>
                    <p style={{ color: '#627084', marginBottom: '25px' }}>{error}</p>
                    <button
                        onClick={refresh}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#1a79ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

                {     }
                <div style={{ marginBottom: '25px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#627084'
                    }}>
                        <span
                            style={{ color: '#1a79ff', cursor: 'pointer' }}
                            onClick={() => navigate('/cabinet')}
                        >
                            Личный кабинет
                        </span>
                        <span style={{ fontSize: '12px' }}>›</span>
                        <span style={{ color: '#263140', fontWeight: '500' }}>Домашние задания</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' }}>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#263140',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <Icon name="assignment" size={28} color="#1a79ff" />
                                Домашние задания
                            </h1>
                        </div>

                        {     }
                        {homeworks.length === 0 ? (
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef',
                                borderRadius: '12px',
                                padding: '40px',
                                textAlign: 'center'
                            }}>
                                <Icon name="assignment" size={48} color="#627084" style={{ marginBottom: '15px' }} />
                                <h3 style={{ color: '#263140', marginBottom: '10px' }}>Нет домашних заданий</h3>
                                <p style={{ color: '#627084' }}>В данный момент у вас нет активных домашних заданий</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {homeworks.map((homework) => (
                                    <HomeworkCard
                                        key={homework.id}
                                        homework={homework}
                                        onSubmitAnswer={submitAnswer}
                                        navigate={navigate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        {     }
                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.borderColor = '#1a79ff';
                                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.borderColor = '#e9ecef';
                                 e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                             }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                marginBottom: '15px',
                                color: '#263140',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <Icon name="analytics" size={20} color="#1a79ff" />
                                Статистика
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0'
                                }}>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <Icon name="assignment" size={14} color="#627084" />
                                        Всего заданий:
                                    </span>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#263140'
                                    }}>
                                        {stats.total}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0'
                                }}>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <Icon name="clock" size={14} color="#FFA500" />
                                        Ожидают выполнения:
                                    </span>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#FFA500'
                                    }}>
                                        {stats.waiting}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0'
                                }}>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <Icon name="time" size={14} color="#1a79ff" />
                                        На проверке:
                                    </span>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#1a79ff'
                                    }}>
                                        {stats.submitted}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0'
                                }}>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <Icon name="certificate" size={14} color="#22C55E" />
                                        Проверено:
                                    </span>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#22C55E'
                                    }}>
                                        {stats.checked}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {     }
                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.borderColor = '#1a79ff';
                                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.borderColor = '#e9ecef';
                                 e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                             }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                marginBottom: '15px',
                                color: '#263140',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <Icon name="star" size={20} color="#1a79ff" />
                                Рекомендации
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    padding: '8px 0'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#1a79ff',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon name="check" size={12} color="#fff" />
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        lineHeight: '1.4'
                                    }}>
                                        Проверяйте задания регулярно
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    padding: '8px 0'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#1a79ff',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon name="clock" size={12} color="#fff" />
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        lineHeight: '1.4'
                                    }}>
                                        Отправляйте работы до дедлайна
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    padding: '8px 0'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#1a79ff',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon name="mentor" size={12} color="#fff" />
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        lineHeight: '1.4'
                                    }}>
                                        Изучайте комментарии наставников
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    padding: '8px 0'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#1a79ff',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon name="support" size={12} color="#fff" />
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#627084',
                                        lineHeight: '1.4'
                                    }}>
                                        Задавайте вопросы при необходимости
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

     
const HomeworkCard = ({ homework, onSubmitAnswer, navigate }) => {
    const [answer, setAnswer] = useState(homework.answer || '');

    const handleSubmit = async () => {
        if (answer.trim()) {
            await onSubmitAnswer(homework.id, answer);
                 
        } else {
            alert('Введите ответ перед отправкой');
        }
    };

         
    const getProgressBarColor = (grade) => {
        const colors = [
            '#EF4444',      
            '#F59E0B',      
            '#EAB308',      
            '#84CC16',      
            '#22C55E'       
        ];
        return colors[grade - 1] || '#EF4444';
    };

    const getStatusStyles = () => {
        let backgroundColor, color, borderColor;

        if (homework.status === 'waiting') {
            backgroundColor = '#FFF3CD';
            color = '#856404';
            borderColor = '#FFEAA7';
        } else if (homework.status === 'submitted') {
            backgroundColor = '#CCE5FF';
            color = '#004085';
            borderColor = '#B3D7FF';
        } else {
            backgroundColor = '#D1E7DD';
            color = '#0F5132';
            borderColor = '#BADBCC';
        }

        return { backgroundColor, color, borderColor };
    };

    const statusStyles = getStatusStyles();

         
    const goToLesson = () => {
        if (homework.lessonId) {
            navigate(`/lesson/${homework.lessonId}`);
        }
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease'
        }}
             onMouseEnter={(e) => {
                 e.currentTarget.style.borderColor = '#1a79ff';
                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
             }}
             onMouseLeave={(e) => {
                 e.currentTarget.style.borderColor = '#e9ecef';
                 e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
             }}>

            {     }
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: '#263140',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Icon name="assignment" size={20} color="#1a79ff" />
                        {homework.title}
                    </h3>
                    <div style={{
                        fontSize: '14px',
                        color: '#627084',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: homework.courseId ? 'pointer' : 'default'
                    }}
                         onClick={homework.courseId ? () => navigate(`/course/${homework.courseId}`) : undefined}
                         onMouseEnter={(e) => {
                             if (homework.courseId) {
                                 e.currentTarget.style.color = '#1a79ff';
                             }
                         }}
                         onMouseLeave={(e) => {
                             if (homework.courseId) {
                                 e.currentTarget.style.color = '#627084';
                             }
                         }}>
                        <Icon name="project" size={14} color="currentColor" />
                        {homework.course}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: '#1a79ff',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: homework.lessonId ? 'pointer' : 'default'
                    }}
                         onClick={goToLesson}
                         onMouseEnter={(e) => {
                             if (homework.lessonId) {
                                 e.currentTarget.style.color = '#1565d8';
                             }
                         }}
                         onMouseLeave={(e) => {
                             if (homework.lessonId) {
                                 e.currentTarget.style.color = '#1a79ff';
                             }
                         }}>
                        <Icon name="book" size={12} color="currentColor" />
                        {homework.lesson}
                    </div>
                </div>

                <div style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: statusStyles.backgroundColor,
                    color: statusStyles.color,
                    border: `1px solid ${statusStyles.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {homework.status === 'waiting' && (
                        <>
                            <Icon name="clock" size={12} color={statusStyles.color} />
                            Ожидает выполнения
                        </>
                    )}
                    {homework.status === 'submitted' && (
                        <>
                            <Icon name="time" size={12} color={statusStyles.color} />
                            Отправлено на проверку
                        </>
                    )}
                    {homework.status === 'checked' && (
                        <>
                            <Icon name="certificate" size={12} color={statusStyles.color} />
                            Проверено
                        </>
                    )}
                </div>
            </div>

            {     }
            {homework.description && (
                <div style={{
                    fontSize: '14px',
                    color: '#627084',
                    lineHeight: '1.5',
                    marginBottom: '15px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    {homework.description}
                </div>
            )}

            {     }
            <div style={{ marginBottom: '15px' }}>
                {homework.status === 'waiting' && (
                    <div style={{
                        fontSize: '13px',
                        color: '#EF4444',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <Icon name="warning" size={14} color="#EF4444" />
                        {homework.deadline}
                    </div>
                )}
                {homework.status === 'submitted' && homework.submittedDate && (
                    <div style={{
                        fontSize: '13px',
                        color: '#627084',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <Icon name="calendar" size={14} color="#627084" />
                        Отправлено: {homework.submittedDate}
                    </div>
                )}
                {homework.status === 'checked' && homework.grade > 0 && (
                    <div>
                        {     }
                        <div style={{
                            width: '100%',
                            height: '50px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                width: `${(homework.grade / 5) * 100}%`,
                                height: '100%',
                                backgroundColor: getProgressBarColor(homework.grade),
                                borderRadius: '12px',
                                transition: 'all 0.3s ease'
                            }} />

                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 20px',
                                pointerEvents: 'none'
                            }}>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: homework.grade >= 3 ? '#fff' : '#374151',
                                    textShadow: homework.grade >= 3 ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <Icon name="star" size={16} color={homework.grade >= 3 ? '#fff' : '#374151'} />
                                    Оценка:
                                </span>

                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    color: homework.grade >= 3 ? '#fff' : '#374151',
                                    textShadow: homework.grade >= 3 ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                    {homework.grade}/5
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {homework.status === 'waiting' && (
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Введите ваш ответ здесь..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                border: '1px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '14px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                            onClick={handleSubmit}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#1a79ff',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1565d8';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(26, 121, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#1a79ff';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <Icon name="send" size={16} color="#fff" />
                            Отправить ответ
                        </button>
                        <button
                            style={{
                                padding: '12px 16px',
                                backgroundColor: '#fff',
                                border: '1px solid #e9ecef',
                                color: '#263140',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#1a79ff';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.borderColor = '#e9ecef';
                            }}
                        >
                            <Icon name="attachment" size={16} color="#263140" />
                            Загрузить файл
                        </button>
                    </div>
                </div>
            )}

            {homework.status === 'submitted' && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#627084',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                    }}>
                        <Icon name="time" size={16} color="#627084" />
                        Ожидайте проверки наставником
                    </div>
                </div>
            )}

            {homework.status === 'checked' && (
                <div>
                    {     }
                    {homework.teacherComment && (
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#263140',
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Icon name="mentor" size={16} color="#1a79ff" />
                                Комментарий преподавателя:
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#627084',
                                lineHeight: '1.5',
                                padding: '12px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                {homework.teacherComment}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomeworkPage;