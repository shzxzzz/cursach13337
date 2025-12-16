import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { useLesson } from '../api/hooks/useLesson.js';

const LessonPage = () => {
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const {
        lesson,
        course,
        relatedData,
        loading,
        error,
        hasAccess,
        downloadFile
    } = useLesson(lessonId);

    // клик по кнопке навигации
    const handleLessonNavigation = (lesson) => {
        if (lesson && lesson.id) {
            navigate(`/lesson/${lesson.id}`);
        }
    };

    // обработка скачки файлов
    const handleDownloadFile = async (file) => {
        const success = await downloadFile(file);
        if (success) {
            console.log(`Файл "${file.name}" скачан`);
        } else {
            alert('Ошибка при скачивании файла');
        }
    };

    // загрузка
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
                    <p style={{ color: '#627084', fontSize: '18px' }}>Загрузка урока...</p>
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

    if (error && error.includes('нет доступа')) {
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
                    <h3 style={{ color: '#d32f2f', marginBottom: '15px' }}>Нет доступа</h3>
                    <p style={{ color: '#627084', marginBottom: '25px' }}>
                        {error || 'У вас нет доступа к этому курсу'}
                    </p>
                    <button
                        onClick={() => navigate('/cabinet')}
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
                        Вернуться в личный кабинет
                    </button>
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
                        onClick={() => window.location.reload()}
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

    if (!lesson) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#fff'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '50px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <Icon name="play" size={40} color="#627084" />
                    </div>
                    <h2 style={{ color: '#263140', marginBottom: '15px' }}>Урок не найден</h2>
                    <p style={{ color: '#627084', marginBottom: '25px' }}>
                        Извините, запрашиваемый урок не существует или был удален.
                    </p>
                    <a
                        href="/courses"
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#1a79ff',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            display: 'inline-block'
                        }}
                    >
                        Вернуться к курсам
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '60px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

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
                        {course && (
                            <>
                                <span
                                    style={{ color: '#1a79ff', cursor: 'pointer' }}
                                    onClick={() => navigate(`/course/${course.id}`)}
                                >
                                    {course.title}
                                </span>
                                <span style={{ fontSize: '12px' }}>›</span>
                            </>
                        )}
                        <span style={{ color: '#263140', fontWeight: '500' }}>{lesson.title}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' }}>

                    <div>
                        {/* плеер типо */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '0',
                            marginBottom: '20px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.borderColor = '#1a79ff';
                                 e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.borderColor = '#e9ecef';
                                 e.currentTarget.style.boxShadow = 'none';
                             }}>
                            <div style={{
                                width: '100%',
                                height: '350px',
                                backgroundColor: '#263140',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: '600',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {lesson.video_url ? (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative'
                                    }}>
                                        <video
                                            src={lesson.video_url}
                                            controls
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <Icon name="play" size={48} color="#fff" />
                                        Видео недоступно
                                    </>
                                )}
                            </div>

                            <div style={{ padding: '20px' }}>
                                <h1 style={{
                                    fontSize: '22px',
                                    fontWeight: '700',
                                    marginBottom: '6px',
                                    color: '#263140'
                                }}>
                                    {lesson.title}
                                </h1>
                                {course && (
                                    <p style={{
                                        color: '#627084',
                                        fontSize: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <Icon name="project" size={16} color="#627084" />
                                        {course.title}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* конспект */}
                        {lesson.description && (
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
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.borderColor = '#e9ecef';
                                 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: isSummaryExpanded ? '15px' : '0',
                                    cursor: 'pointer'
                                }}
                                     onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                                    <h2 style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#263140',
                                        margin: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <Icon name="book" size={20} color="#1a79ff" />
                                        Конспект урока
                                    </h2>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <Icon
                                            name="chevron"
                                            size={16}
                                            color="#1a79ff"
                                            style={{
                                                transition: 'transform 0.3s ease',
                                                transform: isSummaryExpanded ? 'rotate(180deg)' : 'rotate(0)'
                                            }}
                                        />
                                    </div>
                                </div>

                                {isSummaryExpanded && (
                                    <div style={{
                                        color: '#627084',
                                        fontSize: '15px',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-line',
                                        paddingTop: '15px',
                                        borderTop: '1px solid #e9ecef'
                                    }}>
                                        {lesson.description}
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* предыдущий урок */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                flex: 1
                            }}>
                                {relatedData.previousLesson ? (
                                    <button
                                        onClick={() => handleLessonNavigation(relatedData.previousLesson)}
                                        style={{
                                            padding: '12px 18px',
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
                                            gap: '8px',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                            e.target.style.borderColor = '#1a79ff';
                                            e.target.style.transform = 'translateX(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#fff';
                                            e.target.style.borderColor = '#e9ecef';
                                            e.target.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <Icon name="chevron_left" size={16} color="#263140" />
                                        Предыдущий урок
                                    </button>
                                ) : (
                                    <div style={{ width: '1px' }}></div>
                                )}
                            </div>

                            {/* следующий урок */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flex: 1
                            }}>
                                {relatedData.nextLesson ? (
                                    <button
                                        onClick={() => handleLessonNavigation(relatedData.nextLesson)}
                                        style={{
                                            padding: '12px 18px',
                                            backgroundColor: '#1a79ff',
                                            border: '1px solid #1a79ff',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#1565d8';
                                            e.target.style.borderColor = '#1565d8';
                                            e.target.style.transform = 'translateX(2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(26, 121, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#1a79ff';
                                            e.target.style.borderColor = '#1a79ff';
                                            e.target.style.transform = 'translateX(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        Следующий урок
                                        <Icon name="chevron_right" size={16} color="#fff" />
                                    </button>
                                ) : (
                                    <div style={{ width: '1px' }}></div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* материалы */}
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
                                <Icon name="download" size={20} color="#1a79ff" />
                                Материалы для скачивания
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {relatedData.files.length > 0 ? (
                                    relatedData.files.slice(0, 4).map((material, index) => (
                                        <div key={index} style={{
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #e9ecef',
                                            borderRadius: '8px',
                                            padding: '14px',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                             onMouseEnter={(e) => {
                                                 e.currentTarget.style.backgroundColor = '#fff';
                                                 e.currentTarget.style.borderColor = '#1a79ff';
                                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                             }}
                                             onMouseLeave={(e) => {
                                                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                 e.currentTarget.style.borderColor = '#e9ecef';
                                                 e.currentTarget.style.transform = 'translateY(0)';
                                                 e.currentTarget.style.boxShadow = 'none';
                                             }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#1a79ff',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    <Icon name={material.icon} size={20} color="#fff" />
                                                </div>

                                                {/* документ */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#627084',
                                                        marginBottom: '4px'
                                                    }}>
                                                        {material.type}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: '#263140',
                                                        marginBottom: '4px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {material.name}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#627084',
                                                        display: 'flex',
                                                        gap: '8px'
                                                    }}>
                                                        <span>{material.format}</span>
                                                        <span>•</span>
                                                        <span>{material.size}</span>
                                                    </div>
                                                </div>

                                                {/* скачать кнопка */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownloadFile(material);
                                                    }}
                                                    style={{
                                                        padding: '8px',
                                                        backgroundColor: 'transparent',
                                                        border: '1px solid #1a79ff',
                                                        color: '#1a79ff',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: '500',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s ease',
                                                        flexShrink: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '36px',
                                                        height: '36px',
                                                        position: 'relative'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#1a79ff';
                                                        e.currentTarget.style.color = '#fff';
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.color = '#1a79ff';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <Icon name="download" size={16} style={{ transition: 'none' }} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{
                                        padding: '20px',
                                        textAlign: 'center',
                                        color: '#627084',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px'
                                    }}>
                                        Материалы отсутствуют
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* домашка */}
                        {relatedData.homework && (
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
                                    <Icon name="assignment" size={20} color="#1a79ff" />
                                    Домашнее задание
                                </h3>

                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#263140',
                                    marginBottom: '10px'
                                }}>
                                    {relatedData.homework.title}
                                </div>

                                <div style={{
                                    color: '#627084',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    marginBottom: '12px'
                                }}>
                                    {relatedData.homework.description}
                                </div>

                                <div style={{
                                    fontSize: '13px',
                                    color: '#1a79ff',
                                    fontWeight: '600',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <Icon name="clock" size={14} color="#1a79ff" />
                                    {relatedData.homework.deadline}
                                </div>

                                <button
                                    onClick={() => navigate(`/homework/${relatedData.homework.id}`)}
                                    style={{
                                        padding: '12px 18px',
                                        backgroundColor: '#1a79ff',
                                        border: 'none',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
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
                                    <Icon name="play" size={16} color="#fff" />
                                    Перейти к заданию
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;