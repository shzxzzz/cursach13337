import { useState, useEffect } from 'react';
import { Icon } from '../components/Icons.jsx';
import cabinetApi from '../api/cabinetAPI.js';

const CabinetPage = () => {
    const [stats, setStats] = useState({
        activeCourses: 0,
        completedLessons: 0,
        hoursStudied: 0,
        completedCourses: 0
    });

    const [courses, setCourses] = useState([]);
    const [upcomingLessons, setUpcomingLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadData();
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (err) {
                console.error('Ошибка парсинга user:', err);
            }
        }
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await cabinetApi.getDashboard();
            setStats(data.stats || {
                activeCourses: 0,
                completedLessons: 0,
                hoursStudied: 0,
                completedCourses: 0
            });

            setCourses(data.courses || []);
            setUpcomingLessons(data.upcomingLessons || []);

        } catch (error) {
            console.error('Ошибка загрузки данных кабинета:', error);
        } finally {
            setLoading(false);
        }
    };

         
    const getNextLessonForCourse = async (courseId) => {
        try {
            const userId = user?.id || JSON.parse(localStorage.getItem('user'))?.id;

            if (!userId) return null;

                 
            const progressResponse = await fetch(`http://localhost:3000/api/student-lesson-progress?student_id=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const allProgresses = await progressResponse.json();

                 
            const courseResponse = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const courseData = await courseResponse.json();

                 
            const completedLessonIds = new Set();
            allProgresses.forEach(progress => {
                if (progress.is_completed && progress.student_id === userId) {
                    completedLessonIds.add(progress.lesson_id);
                }
            });

                 
            if (courseData.modules && courseData.modules.length > 0) {
                const sortedModules = [...courseData.modules].sort((a, b) => a.order_index - b.order_index);

                for (const module of sortedModules) {
                    if (module.lessons && module.lessons.length > 0) {
                        const sortedLessons = [...module.lessons].sort((a, b) => a.order_index - b.order_index);

                        for (const lesson of sortedLessons) {
                            if (!completedLessonIds.has(lesson.id)) {
                                return lesson;
                            }
                        }
                    }
                }
            }

            return null;

        } catch (error) {
            console.error('Ошибка поиска следующего урока:', error);
            return null;
        }
    };

         
    const getFirstLessonOfCourse = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const course = await response.json();

            if (course.modules && course.modules.length > 0) {
                const sortedModules = [...course.modules].sort((a, b) => a.order_index - b.order_index);

                for (const module of sortedModules) {
                    if (module.lessons && module.lessons.length > 0) {
                        const sortedLessons = [...module.lessons].sort((a, b) => a.order_index - b.order_index);
                        return sortedLessons[0];
                    }
                }
            }

            return null;
        } catch (error) {
            console.error('Ошибка получения первого урока:', error);
            return null;
        }
    };

         
    const handleContinueCourse = async (course, e) => {
        e.stopPropagation();

        try {
                 
            let nextLesson = await getNextLessonForCourse(course.id);

            if (!nextLesson) {
                     
                nextLesson = await getFirstLessonOfCourse(course.id);

                if (!nextLesson) {
                    alert('В этом курсе пока нет уроков');
                    return;
                }
            }

                 
            await markLessonAsStarted(nextLesson.id);

                 
            window.location.href = `/lesson/${nextLesson.id}`;

        } catch (error) {
            console.error('Ошибка при продолжении курса:', error);
            alert('Не удалось загрузить следующий урок. Попробуйте снова.');
        }
    };

         
    const markLessonAsStarted = async (lessonId) => {
        try {
            const userId = user?.id || JSON.parse(localStorage.getItem('user'))?.id;

                 
            const checkResponse = await fetch('http://localhost:3000/api/student-lesson-progress', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (checkResponse.ok) {
                const allProgress = await checkResponse.json();
                const existingProgress = allProgress.find(
                    p => p.student_id === userId && p.lesson_id === lessonId
                );

                if (existingProgress) {
                         
                    await fetch(`http://localhost:3000/api/student-lesson-progress/${existingProgress.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            last_accessed_at: new Date().toISOString(),
                            is_completed: false
                        })
                    });
                } else {
                         
                    await fetch('http://localhost:3000/api/student-lesson-progress', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            student_id: userId,
                            lesson_id: lessonId,
                            is_completed: false,
                            last_accessed_at: new Date().toISOString()
                        })
                    });
                }
            }

        } catch (error) {
            console.error('Ошибка отметки урока:', error);
        }
    };

    const getUserGreeting = () => {
        if (user) {
            const firstName = user.first_name || '';
            const lastName = user.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim();
            return fullName || 'Студент';
        }
        return 'Студент';
    };

    const getCourseIcon = (iconName) => {
        const iconMap = {
            'project': 'project',
            'marketing': 'marketing',
            'design': 'design',
            'development': 'code',
            'analytics': 'analytics'
        };
        return iconMap[iconName] || 'book';
    };

         
    if (loading) {
        return (
            <div style={{ padding: '20px 20px', backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #e9ecef',
                        borderTop: '4px solid #1a79ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p style={{ color: '#627084', fontSize: '16px' }}>Загрузка данных...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px 20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

                {     }
                <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    marginBottom: '15px'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '5px', color: '#263140' }}>
                            Личный кабинет
                        </h1>
                        <p style={{ color: '#627084', fontSize: '16px', fontWeight: '400' }}>
                            Добро пожаловать, {getUserGreeting()}!
                        </p>
                    </div>
                </div>

                {     }
                <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    marginBottom: '15px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px', color: '#263140' }}>
                        Твои достижения
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '10px'
                    }}>

                        {     }
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(17, 98, 212, 0.15)';
                                 e.currentTarget.style.borderColor = '#1a79ff';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = 'none';
                                 e.currentTarget.style.borderColor = '#e9ecef';
                             }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="book" size={20} color="#1a79ff" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#263140',
                                    lineHeight: '1'
                                }}>
                                    {stats.activeCourses}
                                </div>
                                <div style={{
                                    color: '#627084',
                                    fontSize: '13px',
                                    marginTop: '2px'
                                }}>
                                    Активных курсов
                                </div>
                            </div>
                        </div>

                        {     }
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(17, 98, 212, 0.15)';
                                 e.currentTarget.style.borderColor = '#1a79ff';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = 'none';
                                 e.currentTarget.style.borderColor = '#e9ecef';
                             }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="graduation" size={20} color="#1a79ff" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#263140',
                                    lineHeight: '1'
                                }}>
                                    {stats.completedLessons}
                                </div>
                                <div style={{
                                    color: '#627084',
                                    fontSize: '13px',
                                    marginTop: '2px'
                                }}>
                                    Пройденных уроков
                                </div>
                            </div>
                        </div>

                        {     }
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(17, 98, 212, 0.15)';
                                 e.currentTarget.style.borderColor = '#1a79ff';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = 'none';
                                 e.currentTarget.style.borderColor = '#e9ecef';
                             }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="clock" size={20} color="#1a79ff" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#263140',
                                    lineHeight: '1'
                                }}>
                                    {stats.hoursStudied}
                                </div>
                                <div style={{
                                    color: '#627084',
                                    fontSize: '13px',
                                    marginTop: '2px'
                                }}>
                                    Часов обучения
                                </div>
                            </div>
                        </div>

                        {     }
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(17, 98, 212, 0.15)';
                                 e.currentTarget.style.borderColor = '#1a79ff';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = 'none';
                                 e.currentTarget.style.borderColor = '#e9ecef';
                             }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon name="certificate" size={20} color="#1a79ff" />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#263140',
                                    lineHeight: '1'
                                }}>
                                    {stats.completedCourses}
                                </div>
                                <div style={{
                                    color: '#627084',
                                    fontSize: '13px',
                                    marginTop: '2px'
                                }}>
                                    Завершенных курсов
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', alignItems: 'start' }}>

                    {     }
                    <div style={{
                        backgroundColor: '#fff',
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '15px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '15px', color: '#263140' }}>
                            Мои курсы
                        </h2>

                        {courses.length === 0 ? (
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef',
                                borderRadius: '8px',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                <p style={{ color: '#627084', fontSize: '14px' }}>
                                    У вас нет активных курсов
                                </p>
                            </div>
                        ) : (
                            courses.map((course) => (
                                <div key={course.id} style={{
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                     onMouseEnter={(e) => {
                                         e.currentTarget.style.transform = 'translateX(2px)';
                                         e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                                     }}
                                     onMouseLeave={(e) => {
                                         e.currentTarget.style.transform = 'translateX(0)';
                                         e.currentTarget.style.boxShadow = 'none';
                                     }}
                                     onClick={() => window.location.href = `/course/${course.id}`}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            {     }
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                <Icon name={getCourseIcon(course.icon)} size={24} color="#1a79ff" />
                                                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#263140', margin: 0 }}>
                                                    {course.title}
                                                </h3>
                                            </div>
                                            <p style={{ color: '#627084', fontSize: '14px', margin: 0 }}>
                                                {course.completedLessons} из {course.totalLessons} уроков пройдено
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleContinueCourse(course, e)}
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#fff',
                                                border: '1px solid #263140',
                                                color: '#263140',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: '500',
                                                fontSize: '14px',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#1a79ff';
                                                e.target.style.color = '#fff';
                                                e.target.style.transform = 'scale(1.05)';
                                                e.target.style.border = '1px solid #1a79ff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#fff';
                                                e.target.style.color = '#263140';
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.border = '1px solid #263140';
                                            }}>
                                            <Icon name="play" size={14} />
                                            Продолжить
                                        </button>
                                    </div>

                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            backgroundColor: '#e9ecef',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${course.progress}%`,
                                                height: '100%',
                                                backgroundColor: '#1a79ff',
                                                borderRadius: '4px'
                                            }}></div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#627084', fontSize: '12px' }}>Прогресс</span>
                                        <span style={{ color: '#263140', fontSize: '14px', fontWeight: '600' }}>{course.progress}% завершено</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        {     }
                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            marginBottom: '15px'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#263140' }}>
                                Следующие уроки
                            </h2>

                            {upcomingLessons.length === 0 ? (
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#627084', fontSize: '14px', margin: 0 }}>
                                        Все уроки пройдены!
                                    </p>
                                </div>
                            ) : (
                                upcomingLessons.map((lesson) => (
                                    <div key={lesson.id} style={{
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '6px',
                                        padding: '12px',
                                        marginBottom: '8px',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                         onMouseEnter={(e) => {
                                             e.currentTarget.style.transform = 'translateX(2px)';
                                             e.currentTarget.style.borderColor = '#1a79ff';
                                             e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                                         }}
                                         onMouseLeave={(e) => {
                                             e.currentTarget.style.transform = 'translateX(0)';
                                             e.currentTarget.style.borderColor = '#e9ecef';
                                             e.currentTarget.style.boxShadow = 'none';
                                         }}
                                         onClick={() => window.location.href = `/lesson/${lesson.id}`}>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#263140' }}>
                                            {lesson.title}
                                        </h4>
                                        <p style={{ color: '#627084', fontSize: '14px', marginBottom: '4px' }}>
                                            {lesson.courseTitle}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Icon name="clock" size={14} color="#627084" />
                                            <span style={{ color: '#627084', fontSize: '14px' }}>{lesson.duration}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {     }
                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '15px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#263140' }}>
                                Быстрые ссылки
                            </h2>

                            <button style={{
                                width: '100%',
                                padding: '12px 14px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '16px',
                                color: '#263140',
                                marginBottom: '8px',
                                textAlign: 'left',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#1a79ff';
                                        e.target.style.color = '#fff';
                                        e.target.style.transform = 'translateX(3px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(26, 121, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#f8f9fa';
                                        e.target.style.color = '#263140';
                                        e.target.style.transform = 'translateX(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    onClick={() => window.location.href = '/homeworks'}>
                                <Icon name="assignment" size={18} />
                                Домашние задания
                            </button>

                            <button style={{
                                width: '100%',
                                padding: '12px 14px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e9ecef',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '16px',
                                color: '#263140',
                                textAlign: 'left',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#1a79ff';
                                        e.target.style.color = '#fff';
                                        e.target.style.transform = 'translateX(3px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(26, 121, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#f8f9fa';
                                        e.target.style.color = '#263140';
                                        e.target.style.transform = 'translateX(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    onClick={() => window.location.href = '/certificates'}>
                                <Icon name="certificate" size={18} />
                                Сертификаты
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CabinetPage;