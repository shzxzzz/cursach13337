import { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icons.jsx';
import { useParams } from "react-router-dom";
import { useCourse } from '../api/hooks/useCourse';

const CoursePage = () => {
    const { id } = useParams();
    const { course, loading, error } = useCourse(id);

    const [isSticky, setIsSticky] = useState(false);
    const sidebarRef = useRef(null);
    const containerRef = useRef(null);
    const initialSidebarRef = useRef({
        top: 0,
        left: 0,
        width: 0,
        relativeTop: 0
    });

    // эффект для стики блока
    useEffect(() => {
        const handleScroll = () => {
            if (!sidebarRef.current || !containerRef.current || !course) return;

            const sidebar = sidebarRef.current;
            const container = containerRef.current;
            const sidebarRect = sidebar.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // инициализация при первой загрузке
            if (initialSidebarRef.current.top === 0) {
                const rect = sidebar.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                initialSidebarRef.current = {
                    top: rect.top + window.scrollY,
                    left: rect.left,
                    width: rect.width,
                    relativeTop: rect.top - containerRect.top // относительная позиция внутри контейнера
                };
            }

            // расчёт границ для блока
            const startSticky = 120; // высота от верха, когда блок становится экстримли стики
            const containerBottomFromTop = containerRect.bottom + window.scrollY;
            const sidebarHeight = sidebar.offsetHeight;

            const currentScroll = window.scrollY || document.documentElement.scrollTop;

            // нижняя граница
            const stopStickyPoint = containerBottomFromTop - sidebarHeight - 50;

            // верхняя граница
            const startStickyPoint = initialSidebarRef.current.top - startSticky;

            // проверяем, должен ли блок быть стики по границам
            if (currentScroll >= startStickyPoint && currentScroll <= stopStickyPoint) {
                setIsSticky(true);
                sidebar.style.position = 'fixed';
                sidebar.style.top = `${startSticky}px`;
                sidebar.style.left = `${initialSidebarRef.current.left}px`;
                sidebar.style.width = `${initialSidebarRef.current.width}px`;
                sidebar.style.zIndex = '100';
            } else if (currentScroll < startStickyPoint) {

                setIsSticky(false);
                sidebar.style.position = 'relative';
                sidebar.style.top = 'auto';
                sidebar.style.left = 'auto';
                sidebar.style.width = 'auto';
                sidebar.style.zIndex = 'auto';
            } else {

                setIsSticky(false);
                sidebar.style.position = 'absolute';
                sidebar.style.top = `${containerRect.height - sidebarHeight}px`;
                sidebar.style.left = `${initialSidebarRef.current.left}px`;
                sidebar.style.width = `${initialSidebarRef.current.width}px`;
                sidebar.style.zIndex = '100';
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        const initTimer = setTimeout(() => {
            handleScroll();
            // пересчитываем начальные значения после рендера
            if (sidebarRef.current && containerRef.current) {
                const rect = sidebarRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                initialSidebarRef.current = {
                    top: rect.top + window.scrollY,
                    left: rect.left,
                    width: rect.width,
                    relativeTop: rect.top - containerRect.top
                };
            }
        }, 150);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            clearTimeout(initTimer);
        };
    }, [course]);

    // состояния загрузки
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
                    <p style={{ color: '#627084', fontSize: '18px' }}>Загрузка курса...</p>
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

    if (!course) {
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
                        <Icon name="book" size={40} color="#627084" />
                    </div>
                    <h2 style={{ color: '#263140', marginBottom: '15px' }}>Курс не найден</h2>
                    <p style={{ color: '#627084', marginBottom: '25px' }}>
                        Извините, запрашиваемый курс не существует или был удален.
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
        <div style={{ padding: '80px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div ref={containerRef} style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative' }}>

                {/* шапка курса */}
                <div style={{ marginBottom: '50px' }}>
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        color: '#263140',
                        lineHeight: '1.2'
                    }}>
                        {course.title}
                    </h1>

                    <p style={{
                        color: '#627084',
                        fontSize: '18px',
                        lineHeight: '1.6',
                        marginBottom: '30px',
                        maxWidth: '800px'
                    }}>
                        {course.description}
                    </p>

                    {/* информация о курсе */}
                    <div style={{
                        display: 'flex',
                        gap: '30px',
                        alignItems: 'center',
                        marginBottom: '30px',
                        flexWrap: 'wrap'
                    }}>
                        {/* длительность */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s ease',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.backgroundColor = '#e3f2fd';
                                 e.currentTarget.style.transform = 'translateY(-3px)';
                                 e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 121, 255, 0.15)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = 'none';
                             }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                backgroundColor: '#1a79ff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="clock" size={20} color="#fff" />
                            </div>
                            <div>
                                <div style={{
                                    color: '#263140',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}>
                                    {course.duration}
                                </div>
                                <div style={{
                                    color: '#627084',
                                    fontSize: '12px'
                                }}>
                                    Длительность
                                </div>
                            </div>
                        </div>

                        {/* преподаватель */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s ease',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.backgroundColor = '#e3f2fd';
                                 e.currentTarget.style.transform = 'translateY(-3px)';
                                 e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 121, 255, 0.15)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = 'none';
                             }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                backgroundColor: '#1a79ff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="mentor" size={20} color="#fff" />
                            </div>
                            <div>
                                <div style={{
                                    color: '#263140',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}>
                                    {course.teacher}
                                </div>
                                <div style={{
                                    color: '#627084',
                                    fontSize: '12px'
                                }}>
                                    Преподаватель
                                </div>
                            </div>
                        </div>

                        {/* цена */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.backgroundColor = '#e3f2fd';
                                 e.currentTarget.style.transform = 'translateY(-3px)';
                                 e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 121, 255, 0.15)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = 'none';
                             }}>
                            <div>
                                <div style={{
                                    color: '#1a79ff',
                                    fontSize: '20px',
                                    fontWeight: '700'
                                }}>
                                    {course.price} ₽
                                </div>
                                <div style={{
                                    color: '#627084',
                                    fontSize: '12px'
                                }}>
                                    Стоимость
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* кнопка записи */}
                    <button style={{
                        padding: '16px 45px',
                        backgroundColor: '#1a79ff',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '17px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1565d8';
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 12px 25px rgba(26, 121, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#1a79ff';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}>
                        <Icon name="play" size={18} color="#fff" />
                        <span style={{ position: 'relative', zIndex: 2 }}>
                            Записаться на курс
                        </span>
                    </button>
                </div>

                {/* Основной контент */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>

                    {/* программа курса */}
                    <div style={{
                        backgroundColor: '#fff',
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '30px',
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
                        <h2 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            marginBottom: '30px',
                            color: '#263140',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Icon name="project" size={28} color="#1a79ff" />
                            Программа курса
                        </h2>

                        {course.modules.map((module, moduleIndex) => (
                            <div key={module.id || moduleIndex} style={{
                                marginBottom: '30px',
                                position: 'relative',
                                transition: 'all 0.3s ease'
                            }}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = 'translateX(5px)';
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = 'translateX(0)';
                                 }}>
                                {/* Синяя полоска модуля */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-20px',
                                    top: '0',
                                    width: '4px',
                                    height: '100%',
                                    backgroundColor: '#1a79ff',
                                    borderRadius: '2px',
                                    transition: 'all 0.3s ease'
                                }}></div>

                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    color: '#263140',
                                    paddingLeft: '10px',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#1a79ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#263140';
                                    }}>
                                    <Icon name="book" size={20} color="#1a79ff" />
                                    {module.title}
                                </h3>

                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    transition: 'all 0.3s ease'
                                }}
                                     onMouseEnter={(e) => {
                                         e.currentTarget.style.borderColor = '#1a79ff';
                                         e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                                     }}
                                     onMouseLeave={(e) => {
                                         e.currentTarget.style.borderColor = '#e9ecef';
                                         e.currentTarget.style.boxShadow = 'none';
                                     }}>
                                    {module.lessons && module.lessons.length > 0 ? (
                                        module.lessons.map((lesson, lessonIndex) => (
                                            <div key={lesson.id || lessonIndex} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 0',
                                                borderBottom: lessonIndex < module.lessons.length - 1 ? '1px solid #e9ecef' : 'none',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                                 onMouseEnter={(e) => {
                                                     e.currentTarget.style.backgroundColor = '#fff';
                                                     e.currentTarget.style.transform = 'translateX(8px)';
                                                     e.currentTarget.style.borderRadius = '6px';
                                                     e.currentTarget.style.paddingLeft = '12px';
                                                 }}
                                                 onMouseLeave={(e) => {
                                                     e.currentTarget.style.backgroundColor = 'transparent';
                                                     e.currentTarget.style.transform = 'translateX(0)';
                                                     e.currentTarget.style.borderRadius = '0';
                                                     e.currentTarget.style.paddingLeft = '0';
                                                 }}>
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    backgroundColor: '#1a79ff',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease',
                                                    flexShrink: 0
                                                }}
                                                     onMouseEnter={(e) => {
                                                         e.currentTarget.style.transform = 'scale(1.2)';
                                                         e.currentTarget.style.backgroundColor = '#1565d8';
                                                     }}
                                                     onMouseLeave={(e) => {
                                                         e.currentTarget.style.transform = 'scale(1)';
                                                         e.currentTarget.style.backgroundColor = '#1a79ff';
                                                     }}>
                                                    <Icon name="play" size={12} color="#fff" />
                                                </div>
                                                <span style={{
                                                    color: '#263140',
                                                    fontSize: '16px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                      onMouseEnter={(e) => {
                                                          e.currentTarget.style.color = '#1a79ff';
                                                      }}
                                                      onMouseLeave={(e) => {
                                                          e.currentTarget.style.color = '#263140';
                                                      }}>
                                                    {lesson.title || `Урок ${lessonIndex + 1}`}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{
                                            padding: '20px',
                                            textAlign: 'center',
                                            color: '#627084'
                                        }}>
                                            Уроки пока не добавлены
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* бешеный стики блок справа */}
                    <div style={{
                        position: 'relative',
                        height: 'fit-content'
                    }}>
                        <div
                            ref={sidebarRef}
                            style={{
                                width: '400px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                backgroundColor: '#fff',
                                border: '1px solid #e9ecef',
                                borderRadius: '12px',
                                padding: '25px',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s ease'
                            }}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = 'translateY(-5px)';
                                     e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                                     e.currentTarget.style.borderColor = '#1a79ff';
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = 'translateY(0)';
                                     e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
                                     e.currentTarget.style.borderColor = '#e9ecef';
                                 }}>
                                {/* Преподаватель */}
                                <div style={{ marginBottom: '25px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        marginBottom: '15px'
                                    }}>
                                        {course.teacherInfo.avatar ? (
                                            <img
                                                src={course.teacherInfo.avatar}
                                                alt={course.teacher}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '2px solid #1a79ff'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#1a79ff',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Icon name="user" size={24} color="#fff" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 style={{
                                                fontSize: '20px',
                                                fontWeight: '700',
                                                marginBottom: '4px',
                                                color: '#263140'
                                            }}>
                                                {course.teacher}
                                            </h3>
                                            <p style={{
                                                color: '#627084',
                                                fontSize: '14px',
                                                marginBottom: '12px'
                                            }}>
                                                Преподаватель
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <Icon name="project" size={16} color="#627084" />
                                        <p style={{
                                            color: '#627084',
                                            fontSize: '14px'
                                        }}>
                                            {course.teacherInfo.position}
                                        </p>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '15px'
                                    }}>
                                        <Icon name="graduation" size={16} color="#627084" />
                                        <p style={{
                                            color: '#627084',
                                            fontSize: '14px'
                                        }}>
                                            {course.teacherInfo.experience}
                                        </p>
                                    </div>

                                    {course.teacherInfo.achievements && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '8px',
                                            marginBottom: '15px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '16px',
                                                height: '16px',
                                                flexShrink: 0,
                                                marginTop: '2px'
                                            }}>

                                            </div>
                                            <p style={{
                                                color: '#627084',
                                                fontSize: '14px',
                                                lineHeight: '1.5'
                                            }}>
                                                {course.teacherInfo.achievements}
                                            </p>
                                        </div>
                                    )}

                                    <div style={{
                                        width: '100%',
                                        height: '1px',
                                        backgroundColor: '#e9ecef',
                                        margin: '20px 0',
                                        transition: 'all 0.3s ease'
                                    }}></div>
                                </div>

                                {/* входит в стоимость */}
                                <div style={{ marginBottom: '25px' }}>
                                    <h4 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '15px',
                                        color: '#263140',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <Icon name="certificate" size={20} color="#1a79ff" />
                                        В стоимость входит:
                                    </h4>

                                    {[
                                        { text: 'Видеоуроки', icon: 'play' },
                                        { text: 'Методические материалы', icon: 'book' },
                                        { text: 'Проверка домашних заданий', icon: 'assignment' },
                                        { text: 'Сертификат', icon: 'certificate' }
                                    ].map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 0',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                             onMouseEnter={(e) => {
                                                 e.currentTarget.style.transform = 'translateX(5px)';
                                                 e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                 e.currentTarget.style.paddingLeft = '12px';
                                                 e.currentTarget.style.borderRadius = '6px';
                                             }}
                                             onMouseLeave={(e) => {
                                                 e.currentTarget.style.transform = 'translateX(0)';
                                                 e.currentTarget.style.backgroundColor = 'transparent';
                                                 e.currentTarget.style.paddingLeft = '0';
                                                 e.currentTarget.style.borderRadius = '0';
                                             }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: '#1a79ff',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease',
                                                flexShrink: 0
                                            }}
                                                 onMouseEnter={(e) => {
                                                     e.currentTarget.style.transform = 'rotate(15deg) scale(1.2)';
                                                     e.currentTarget.style.backgroundColor = '#1565d8';
                                                 }}
                                                 onMouseLeave={(e) => {
                                                     e.currentTarget.style.transform = 'rotate(0) scale(1)';
                                                     e.currentTarget.style.backgroundColor = '#1a79ff';
                                                 }}>
                                                <Icon name={item.icon} size={12} color="#fff" />
                                            </div>
                                            <span style={{
                                                color: '#627084',
                                                fontSize: '14px',
                                                transition: 'all 0.3s ease'
                                            }}
                                                  onMouseEnter={(e) => {
                                                      e.currentTarget.style.color = '#1a79ff';
                                                      e.currentTarget.style.fontWeight = '600';
                                                  }}
                                                  onMouseLeave={(e) => {
                                                      e.currentTarget.style.color = '#627084';
                                                      e.currentTarget.style.fontWeight = '400';
                                                  }}>
                                                {item.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* кнопка записи */}
                                <button style={{
                                    width: '100%',
                                    padding: '16px 20px',
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
                                            e.target.style.backgroundColor = '#1565d8';
                                            e.target.style.transform = 'translateY(-3px)';
                                            e.target.style.boxShadow = '0 10px 25px rgba(26, 121, 255, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#1a79ff';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}>
                                    <Icon name="play" size={18} color="#fff" />
                                    Записаться на курс
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* что вы получите */}
                <div style={{
                    marginTop: '60px',
                    maxWidth: '66.666%'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '30px',
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
                        <h2 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            marginBottom: '30px',
                            color: '#263140',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Icon name="star" size={28} color="#1a79ff" />
                            Что вы получите
                        </h2>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '30px',
                            transition: 'all 0.3s ease'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.borderColor = '#1a79ff';
                                 e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.borderColor = '#e9ecef';
                                 e.currentTarget.style.boxShadow = 'none';
                             }}>
                            {course.benefits.map((benefit, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '15px 0',
                                    borderBottom: index < course.benefits.length - 1 ? '1px solid #e9ecef' : 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                     onMouseEnter={(e) => {
                                         e.currentTarget.style.backgroundColor = '#fff';
                                         e.currentTarget.style.transform = 'translateX(8px)';
                                         e.currentTarget.style.borderRadius = '8px';
                                         e.currentTarget.style.paddingLeft = '15px';
                                     }}
                                     onMouseLeave={(e) => {
                                         e.currentTarget.style.backgroundColor = 'transparent';
                                         e.currentTarget.style.transform = 'translateX(0)';
                                         e.currentTarget.style.borderRadius = '0';
                                         e.currentTarget.style.paddingLeft = '0';
                                     }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        backgroundColor: '#1a79ff',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        flexShrink: 0
                                    }}
                                         onMouseEnter={(e) => {
                                             e.currentTarget.style.transform = 'rotate(10deg) scale(1.2)';
                                             e.currentTarget.style.backgroundColor = '#1565d8';
                                         }}
                                         onMouseLeave={(e) => {
                                             e.currentTarget.style.transform = 'rotate(0) scale(1)';
                                             e.currentTarget.style.backgroundColor = '#1a79ff';
                                         }}>
                                        <Icon name="graduation" size={16} color="#fff" />
                                    </div>
                                    <span style={{
                                        color: '#263140',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease'
                                    }}
                                          onMouseEnter={(e) => {
                                              e.currentTarget.style.color = '#1a79ff';
                                          }}
                                          onMouseLeave={(e) => {
                                              e.currentTarget.style.color = '#263140';
                                          }}>
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;