     
import { useRef, useEffect, useState } from 'react';
import { Icon } from './Icons.jsx';

const CourseSidebar = ({ course, isEnrolled, onEnrollClick, enrollmentLoading }) => {
    const sidebarRef = useRef(null);
    const containerRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState('400px');

    useEffect(() => {
        let animationFrameId = null;

        const updateSidebarWidth = () => {
            if (sidebarRef.current) {
                const width = sidebarRef.current.offsetWidth;
                setSidebarWidth(`${width}px`);
            }
        };

        const handleScroll = () => {
            if (!sidebarRef.current || !containerRef.current || !course) return;

            animationFrameId = requestAnimationFrame(() => {
                const sidebar = sidebarRef.current;
                const container = containerRef.current;

                const sidebarRect = sidebar.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const headerOffset = 120;

                     
                const containerTop = containerRect.top + window.scrollY;
                const containerBottom = containerTop + containerRect.height;

                     
                const startStickyPoint = containerTop - headerOffset;
                const stopStickyPoint = containerBottom - sidebarRect.height - 50;
                const currentScroll = window.scrollY;

                if (currentScroll >= startStickyPoint && currentScroll <= stopStickyPoint) {
                         
                    if (!isSticky) setIsSticky(true);

                    sidebar.style.position = 'fixed';
                    sidebar.style.top = `${headerOffset}px`;
                    sidebar.style.left = `${containerRect.left}px`;
                    sidebar.style.width = `${sidebarRect.width}px`;
                    sidebar.style.zIndex = '100';
                }
                else if (currentScroll < startStickyPoint) {
                         
                    if (isSticky) setIsSticky(false);

                    sidebar.style.position = 'relative';
                    sidebar.style.top = 'auto';
                    sidebar.style.left = 'auto';
                    sidebar.style.width = '100%';
                    sidebar.style.zIndex = 'auto';
                }
                else {
                         
                    if (isSticky) setIsSticky(false);

                    sidebar.style.position = 'absolute';
                    sidebar.style.bottom = '0';
                    sidebar.style.top = 'auto';
                    sidebar.style.left = '0';
                    sidebar.style.width = '100%';
                    sidebar.style.zIndex = '100';
                }
            });
        };

        const handleResize = () => {
            if (sidebarRef.current) {
                     
                sidebarRef.current.style.position = 'relative';
                sidebarRef.current.style.top = 'auto';
                sidebarRef.current.style.left = 'auto';
                sidebarRef.current.style.width = '100%';
                setIsSticky(false);
            }

            updateSidebarWidth();
            setTimeout(handleScroll, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

             
        const initTimer = setTimeout(() => {
            updateSidebarWidth();
            handleScroll();
        }, 300);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(initTimer);
        };
    }, [course, isSticky]);

         
    const getTeacherInfo = () => {
        if (!course || !course.teacherInfo) {
            return {
                name: 'Информация не указана',
                position: 'Преподаватель',
                experience: 'Опытный преподаватель',
                avatar: null
            };
        }

        const teacher = course.teacherInfo;
        return {
            name: teacher.name || 'Преподаватель',
            position: teacher.position || 'Преподаватель',
            experience: teacher.experience || 'Опытный преподаватель',
            avatar: teacher.avatar
        };
    };

    const teacherInfo = getTeacherInfo();

         
    const TeacherInfo = () => (
        <div style={{ marginBottom: '25px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '15px'
            }}>
                {teacherInfo.avatar ? (
                    <img
                        src={teacherInfo.avatar}
                        alt={teacherInfo.name}
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
                        {teacherInfo.name}
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
                    {teacherInfo.position}
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
                    {teacherInfo.experience}
                </p>
            </div>

            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#e9ecef',
                margin: '20px 0',
                transition: 'all 0.3s ease'
            }}></div>
        </div>
    );

         
    const CourseInclusions = () => {
        const inclusions = [
            { text: 'Видеоуроки', icon: 'play' },
            { text: 'Методические материалы', icon: 'book' },
            { text: 'Проверка домашних заданий', icon: 'assignment' },
            { text: 'Сертификат', icon: 'certificate' }
        ];

        return (
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

                {inclusions.map((item, index) => (
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
        );
    };

         
    const EnrollButton = ({ isEnrolled, onEnrollClick, loading }) => (
        <button
            onClick={onEnrollClick}
            disabled={isEnrolled || loading}
            style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: isEnrolled ? '#28a745' : '#1a79ff',
                border: 'none',
                color: '#fff',
                borderRadius: '10px',
                cursor: isEnrolled ? 'default' : (loading ? 'wait' : 'pointer'),
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: isEnrolled ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
                if (!isEnrolled && !loading) {
                    e.target.style.backgroundColor = '#1565d8';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(26, 121, 255, 0.4)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isEnrolled && !loading) {
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
                    <Icon name="play" size={18} color="#fff" />
                    {isEnrolled ? 'Вы уже записаны' : 'Записаться на курс'}
                </>
            )}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </button>
    );

    return (
        <div ref={containerRef} style={{
            position: 'relative',
            height: 'fit-content'
        }}>
            <div
                ref={sidebarRef}
                style={{
                    width: '100%',
                    maxWidth: '400px',
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

                    <TeacherInfo />

                    <CourseInclusions />

                    <EnrollButton
                        isEnrolled={isEnrolled}
                        onEnrollClick={onEnrollClick}
                        loading={enrollmentLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;