import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import AuthModal from '../components/Auth.jsx';
import ErrorModal from '../components/ErrorModal.jsx';

import Header from '../components/Header.jsx';
import CourseCard from '../components/CourseCard.jsx';
import BenefitCard from '../components/BenefitCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import FooterSection from '../components/FooterSection.jsx';

const MainPage = () => {
    const navigate = useNavigate();
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [hoveredBenefit, setHoveredBenefit] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

         
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);

         
    const [errorModal, setErrorModal] = useState(null);

         
    const [checkingEnrollments, setCheckingEnrollments] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

         
    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

         
    useEffect(() => {
        const loadCourses = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/courses');
                const data = await res.json();
                setCourses(data);
            } catch (err) {
                console.error('Ошибка загрузки курсов', err);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

         
    const checkEnrollment = async (courseId) => {
        if (!user) return false;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:3000/api/enrollments?student_id=${user.id}&course_id=${courseId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const enrollments = await response.json();
                return enrollments.length > 0;
            }
            return false;
        } catch (err) {
            console.error('Ошибка проверки записи:', err);
            return false;
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCabinetClick = () => {
        if (user) {
            navigate('/cabinet/');
        } else {
            setIsAuthModalOpen(true);
        }
    };

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const handleEnrollClick = async (courseId) => {
             
        setCheckingEnrollments(prev => ({ ...prev, [courseId]: true }));

        if (!user) {
            setErrorModal({
                message: 'Для записи на курс необходимо авторизоваться',
                action: () => setIsAuthModalOpen(true)
            });
            setCheckingEnrollments(prev => ({ ...prev, [courseId]: false }));
            return;
        }

        try {
                 
            const isAlreadyEnrolled = await checkEnrollment(courseId);

            if (isAlreadyEnrolled) {
                setErrorModal({
                    message: 'Вы уже записаны на этот курс',
                    action: () => navigate('/cabinet/')
                });
                setCheckingEnrollments(prev => ({ ...prev, [courseId]: false }));
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/enrollments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student_id: user.id,
                    course_id: courseId
                })
            });

            if (!response.ok) {
                const data = await response.json();

                     
                if (data.error && data.error.includes('уже записан')) {
                    setErrorModal({
                        message: 'Вы уже записаны на этот курс',
                        action: () => navigate('/cabinet/')
                    });
                    setCheckingEnrollments(prev => ({ ...prev, [courseId]: false }));
                    return;
                }

                throw new Error(data.error || 'Ошибка записи на курс');
            }

            const data = await response.json();

                 
            navigate('/cabinet/');

        } catch (error) {
            console.error('Ошибка записи на курс:', error);
            setErrorModal({
                message: error.message || 'Произошла ошибка при записи на курс',
                action: null
            });
        } finally {
            setCheckingEnrollments(prev => ({ ...prev, [courseId]: false }));
        }
    };

         
    const closeErrorModal = () => {
        setErrorModal(null);
        if (errorModal && errorModal.action) {
            errorModal.action();
        }
    };

    const benefitsData = [
        {
            id: 1,
            icon: "certificate",
            title: "Сертификация",
            description: "Официальные сертификаты по окончании курсов"
        },
        {
            id: 2,
            icon: "clock",
            title: "Доступ 24/7",
            description: "Учитесь в удобное для вас время"
        },
        {
            id: 3,
            icon: "mentor",
            title: "Помощь наставников",
            description: "Поддержка экспертов на всех этапах"
        },
        {
            id: 4,
            icon: "assignment",
            title: "Практические задания",
            description: "Домашние работы с проверкой"
        }
    ];

    return (
        <div style={{ margin: 0, padding: 0, width: '100%' }}>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <ErrorModal
                error={errorModal?.message}
                onClose={closeErrorModal}
            />

            <Header
                isHeaderScrolled={isHeaderScrolled}
                user={user}
                scrollToTop={scrollToTop}
                scrollToSection={scrollToSection}
                handleCabinetClick={handleCabinetClick}
                handleLogout={handleLogout}
                setIsAuthModalOpen={setIsAuthModalOpen}
            />

            <div style={{ marginTop: '100px' }}>

                {     }
                <section className="hero" style={{
                    backgroundColor: '#f3f7fe',
                    padding: '80px 20px',
                    textAlign: 'center',
                    width: '100%',
                    margin: 0
                }}>
                    <div className="hero-content" style={{
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <div style={{ marginBottom: '24px' }}>
                            <Icon name="graduation" size={64} color="#1a79ff" />
                        </div>
                        <h1 className="hero-title" style={{
                            fontSize: '48px',
                            fontWeight: '700',
                            lineHeight: '1.2',
                            marginBottom: '24px',
                            color: '#263140'
                        }}>
                            Корпоративная образовательная платформа
                        </h1>
                        <p className="hero-subtitle" style={{
                            fontSize: '20px',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#627084',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Онлайн-обучение сотрудников с уроками, материалами и проверкой домашнего задания
                        </p>

                        {!user && (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                style={{
                                    marginTop: '40px',
                                    padding: '16px 40px',
                                    backgroundColor: '#1a79ff',
                                    border: 'none',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '18px',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#1565d8';
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 15px 30px rgba(26, 121, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#1a79ff';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <Icon name="play" size={20} color="#fff" />
                                Начать обучение бесплатно
                            </button>
                        )}
                    </div>
                </section>

                {     }
                <section id="courses-section" style={{
                    padding: '80px 20px',
                    backgroundColor: '#fff'
                }}>
                    <div style={{
                        maxWidth: '1500px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            textAlign: 'center',
                            marginBottom: '60px',
                            color: '#263140'
                        }}>
                            Каталог курсов
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                            gap: '50px',
                            justifyItems: 'center'
                        }}>
                            {loading ? (
                                <p style={{ textAlign: 'center' }}>Загрузка курсов...</p>
                            ) : (
                                courses.map(course => (
                                    <CourseCard
                                        key={course.id}
                                        course={{
                                            id: course.id,
                                            name: course.title,
                                            description: course.short_description || course.description,
                                            lessons: `${course.lessons_count || 0} уроков`,
                                            duration: `${course.duration || 0} недель`,
                                            students: `${course.student_count || 0} студентов`,
                                            icon: "code"
                                        }}
                                        isHovered={hoveredCourse === course.id}
                                        onHover={setHoveredCourse}
                                        onDetailsClick={() => navigate(`/course/${course.id}`)}
                                        onEnrollClick={() => handleEnrollClick(course.id)}
                                        isEnrolling={checkingEnrollments[course.id]}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {     }
                <section id="benefits-section" style={{
                    padding: '80px 20px',
                    backgroundColor: '#f3f4f7',
                    width: '100%',
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            textAlign: 'center',
                            marginBottom: '60px',
                            color: '#263140'
                        }}>
                            Преимущества платформы
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '30px'
                        }}>
                            {benefitsData.map((benefit) => (
                                <BenefitCard
                                    key={benefit.id}
                                    benefit={benefit}
                                    isHovered={hoveredBenefit === benefit.id}
                                    onHover={setHoveredBenefit}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {     }
                <section style={{
                    padding: '80px 20px',
                    backgroundColor: '#fff'
                }}>
                    <div style={{
                        maxWidth: '1500px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            textAlign: 'center',
                            marginBottom: '60px',
                            color: '#263140'
                        }}>
                            Отзывы студентов
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '30px'
                        }}>
                            <ReviewCard
                                stars={5}
                                text="Отличная платформа для развития! Курс по управлению проектами помог систематизировать знания и получить новые инструменты для работы."
                                name="Анна Смирнова"
                                position="Product Manager, ТехКомпания"
                            />
                            <ReviewCard
                                stars={5}
                                text="Удобный формат обучения, качественные материалы и практические задания. Наставники всегда на связи и помогают разобраться."
                                name="Дмитрий Петров"
                                position="Marketing Director, Инновации Групп"
                            />
                            <ReviewCard
                                stars={5}
                                text="Прошла курс по анализу данных - очень довольна! Получила сертификат и уверенно применяю знания в работе."
                                name="Елена Иванова"
                                position="Data Analyst, Аналитика Плюс"
                            />
                        </div>
                    </div>
                </section>

                {     }
                <FooterSection />
            </div>
        </div>
    );
};

export default MainPage;