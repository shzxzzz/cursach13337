import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import AuthModal from '../components/Auth.jsx';

const MainPage = () => {
    const navigate = useNavigate();
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [hoveredBenefit, setHoveredBenefit] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // состояния для авторизации
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Проверяем авторизацию при загрузке
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // эффект для отслеживания скролла
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

            {/* шапка */}
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
                {/* кнопка лого */}
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

                {/* навигация */}
                <nav style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '40px',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}>
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
                        onClick={() => scrollToSection('courses-section')}
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
                        Курсы
                    </b>
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
                        onClick={() => scrollToSection('benefits-section')}
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
                        О нас
                    </b>
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
                        onClick={() => scrollToSection('footer-section')}
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
                        Контакты
                    </b>
                </nav>

                {/* авторизации или личный кабинет */}
                <div style={{ display: 'flex', gap: '15px', marginLeft: 'auto' }}>
                    {user ? (
                        <>
                            {/* личный кабинета */}
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

                            {/* выход */}
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
                            {/* вход */}
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

                            {/* регистрация */}
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
            </header>

            <div style={{ marginTop: '100px' }}> {/*отступ от шапки*/}

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

                {/* карточки с курсами */}
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
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* преимущества */}
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

                {/* отзывы */}
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

                {/* подвал */}
                <footer id="footer-section" style={{
                    padding: '60px 20px 30px',
                    backgroundColor: '#f3f4f7',
                    width: '100%',
                }}>
                    <FooterContent />
                </footer>
            </div>
        </div>
    );
};

// карточки курса
const CourseCard = ({ course, isHovered, onHover }) => {
    return (
        <div
            style={{
                backgroundColor: '#fff',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                maxWidth: '450px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={() => onHover(course.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* иконка на фоне */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: isHovered ? 0.1 : 0.05,
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1)'
            }}>
                <Icon name={course.icon} size={80} color="#1a79ff" />
            </div>

            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#263140',
                textAlign: 'left',
                position: 'relative',
                zIndex: 2
            }}>
                {course.name}
            </h3>
            <p style={{
                color: '#627084',
                lineHeight: '1.6',
                marginBottom: '20px',
                textAlign: 'left',
                fontSize: '14px',
                position: 'relative',
                zIndex: 2
            }}>
                {course.description}
            </p>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '25px',
                alignItems: 'center',
                textAlign: 'left',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="book" size={16} color={isHovered ? "#1a79ff" : "#627084"} />
                    <span style={{
                        color: '#263140',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                    }}>
                        {course.lessons}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="clock" size={16} color={isHovered ? "#1a79ff" : "#627084"} />
                    <span style={{
                        color: '#263140',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                    }}>
                        {course.duration}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="users" size={16} color={isHovered ? "#1a79ff" : "#627084"} />
                    <span style={{
                        color: '#263140',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                    }}>
                        {course.students}
                    </span>
                </div>
            </div>
            <div style={{
                display: 'flex',
                gap: '12px',
                position: 'relative',
                zIndex: 2
            }}>
                <button style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: `1px solid ${isHovered ? '#1a79ff' : '#1a79ff'}`,
                    color: isHovered ? '#fff' : '#1a79ff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    backgroundColor: isHovered ? '#1a79ff' : 'transparent'
                }}>
                    Подробнее
                </button>
                <button style={{
                    flex: 1,
                    padding: '12px 20px',
                    backgroundColor: isHovered ? '#1565d8' : '#1a79ff',
                    border: `1px solid ${isHovered ? '#1565d8' : '#1a79ff'}`,
                    color: '#fff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                }}>
                    Записаться
                </button>
            </div>
        </div>
    );
};

// компонент преимущества
const BenefitCard = ({ benefit, isHovered, onHover }) => {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: '20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                backgroundColor: isHovered ? '#fff' : 'transparent',
                boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onMouseEnter={() => onHover(benefit.id)}
            onMouseLeave={() => onHover(null)}
        >
            <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: isHovered ? '#1a79ff' : '#dce5f3',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
            }}>
                <Icon
                    name={benefit.icon}
                    size={32}
                    color={isHovered ? "#fff" : "#1a79ff"}
                />
            </div>
            <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
                transition: 'color 0.3s ease',
                color: isHovered ? '#1a79ff' : '#263140'
            }}>
                {benefit.title}
            </h3>
            <p style={{
                color: '#627084',
                lineHeight: '1.5',
                transition: 'color 0.3s ease'
            }}>
                {benefit.description}
            </p>
        </div>
    );
};

// компонент отзыва
const ReviewCard = ({ stars, text, name, position }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                backgroundColor: '#fff',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                marginBottom: '20px',
                textAlign: 'left',
                display: 'flex',
                gap: '4px'
            }}>
                {[...Array(stars)].map((_, i) => (
                    <Icon
                        key={i}
                        name="star"
                        size={20}
                        color="#1a79ff"
                        style={{
                            transform: isHovered ? `scale(${1 + i * 0.05})` : 'scale(1)',
                            transition: `transform 0.3s ease ${i * 0.1}s`
                        }}
                    />
                ))}
            </div>
            <p style={{
                color: '#627084',
                lineHeight: '1.6',
                marginBottom: '25px',
                textAlign: 'left',
            }}>
                "{text}"
            </p>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f7fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon name="user" size={20} color="#1a79ff" />
                </div>
                <div>
                    <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '1px',
                        color: '#263140',
                        textAlign: 'left'
                    }}>
                        {name}
                    </h4>
                    <p style={{
                        color: '#627084',
                        fontSize: '14px',
                        textAlign: 'left'
                    }}>
                        {position}
                    </p>
                </div>
            </div>
        </div>
    );
};

// пiдвал
const FooterContent = () => {
    return (
        <>
            <div style={{
                maxWidth: '1500px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                marginBottom: '40px',
            }}>
                <div style={{ textAlign: 'left' }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        color: '#263140',
                        textAlign: 'left'
                    }}>
                        О платформе
                    </h3>
                    <p style={{
                        color: '#627084',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        textAlign: 'left'
                    }}>
                        Корпоративная образовательная платформа для профессионального развития сотрудников
                    </p>
                </div>

                <div style={{ textAlign: 'left' }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        color: '#263140',
                        textAlign: 'left'
                    }}>
                        Контакты
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                            <Icon name="phone" size={16} color="#627084" />
                            <span style={{ color: '#627084', fontWeight: '500' }}>+7 (800) 555-35-35</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                            <Icon name="email" size={16} color="#627084" />
                            <span style={{ color: '#627084', fontWeight: '500' }}>info@eduplatform.ru</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                            <Icon name="location" size={16} color="#627084" />
                            <span style={{ color: '#627084', fontWeight: '500' }}>Киров, ул. Московская, д.36</span>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        color: '#263140',
                        textAlign: 'left'
                    }}>
                        Режим работы
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                            <Icon name="support" size={16} color="#627084" />
                            <span style={{ color: '#627084', fontWeight: '500' }}>Поддержка: Сб-Вс, 25:00-26:00</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                            <Icon name="clock" size={16} color="#627084" />
                            <span style={{ color: '#627084', fontWeight: '500' }}>Обучение: круглосуточно</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                borderTop: '1px solid #e9ecef',
                paddingTop: '20px',
                textAlign: 'center'
            }}>
                <p style={{
                    color: '#627084',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    © 2025 Платформа. Все права защищены.
                </p>
            </div>
        </>
    );
};

export default MainPage;