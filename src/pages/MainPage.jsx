import HeaderSection from '/src//components/Header.jsx';
import CoursesSection from '/src//components/Courses.jsx';
import StarIcon from '/src/components/StarIcon';

const MainPage = () => {
    return (
        <div style={{ margin: 0, padding: 0, width: '100%' }}>
            <HeaderSection />
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
                </div>
            </section>

            <CoursesSection />

            <section style={{
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
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '30px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                fontSize: '32px'
                            }}>
                                📜
                            </div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#263140'
                            }}>
                                Сертификация
                            </h3>
                            <p style={{
                                color: '#627084',
                                lineHeight: '1.5'
                            }}>
                                Официальные сертификаты по окончании курсов
                            </p>
                        </div>

                        {/* Преимущество 2 */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                fontSize: '32px'
                            }}>
                                ⏰
                            </div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#263140'
                            }}>
                                Доступ 24/7
                            </h3>
                            <p style={{
                                color: '#627084',
                                lineHeight: '1.5'
                            }}>
                                Учитесь в удобное для вас время
                            </p>
                        </div>

                        {/* Преимущество 3 */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                fontSize: '32px'
                            }}>
                                👨‍🏫
                            </div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#263140'
                            }}>
                                Помощь наставников
                            </h3>
                            <p style={{
                                color: '#627084',
                                lineHeight: '1.5'
                            }}>
                                Поддержка экспертов на всех этапах
                            </p>
                        </div>

                        {/* Преимущество 4 */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#dce5f3',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                fontSize: '32px'
                            }}>
                                📝
                            </div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#263140'
                            }}>
                                Практические задания
                            </h3>
                            <p style={{
                                color: '#627084',
                                lineHeight: '1.5'
                            }}>
                                Домашние работы с проверкой
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <section style={{
                padding: '80px 20px',
                backgroundColor: '#fff'
            }}>
                <div style={{
                    maxWidth: '1500px',
                    margin: '0 auto'
                }}>
                    {/* Заголовок */}
                    <h2 style={{
                        fontSize: '26px',
                        fontWeight: '700',
                        textAlign: 'center',
                        marginBottom: '60px',
                        color: '#263140'
                    }}>
                        Отзывы студентов
                    </h2>

                    {/*  отзывы */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '30px'
                    }}>

                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '30px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                marginBottom: '20px',
                                textAlign: 'left',
                                display: 'flex',
                                gap: '2px'
                            }}>
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />

                            </div>
                            <p style={{
                                color: '#627084',
                                lineHeight: '1.6',
                                marginBottom: '25px',
                                textAlign: 'left',
                            }}>
                                "Отличная платформа для развития! Курс по управлению проектами помог систематизировать знания и получить новые инструменты для работы."
                            </p>
                            <div>
                                <h4 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '5px',
                                    color: '#263140',
                                    textAlign: 'left'
                                }}>
                                    Анна Смирнова
                                </h4>
                                <p style={{
                                    color: '#627084',
                                    fontSize: '14px',
                                    textAlign: 'left'
                                }}>
                                    Product Manager, ТехКомпания
                                </p>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '30px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                marginBottom: '20px',
                                textAlign: 'left',
                                display: 'flex',
                                gap: '2px'
                            }}>
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />

                            </div>
                            <p style={{
                                color: '#627084',
                                lineHeight: '1.6',
                                marginBottom: '25px',
                                textAlign: 'left'
                            }}>
                                "Удобный формат обучения, качественные материалы и практические задания. Наставники всегда на связи и помогают разобраться."
                            </p>
                            <div>
                                <h4 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '5px',
                                    color: '#263140',
                                    textAlign: 'left'
                                }}>
                                    Дмитрий Петров
                                </h4>
                                <p style={{
                                    color: '#627084',
                                    fontSize: '14px',
                                    textAlign: 'left'
                                }}>
                                    Marketing Director, Инновации Групп
                                </p>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '30px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                marginBottom: '20px',
                                textAlign: 'left',
                                display: 'flex',
                                gap: '2px'
                            }}>
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />
                                <StarIcon />

                            </div>
                            <p style={{
                                color: '#627084',
                                lineHeight: '1.6',
                                marginBottom: '25px',
                                textAlign: 'left'
                            }}>
                                "Прошла курс по анализу данных - очень довольна! Получила сертификат и уверенно применяю знания в работе."
                            </p>
                            <div>
                                <h4 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '5px',
                                    color: '#263140',
                                    textAlign: 'left'
                                }}>
                                    Елена Иванова
                                </h4>
                                <p style={{
                                    color: '#627084',
                                    fontSize: '14px',
                                    textAlign: 'left'
                                }}>
                                    Data Analyst, Аналитика Плюс
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <footer style={{
                padding: '60px 20px 30px',
                backgroundColor: '#f3f4f7',
                width: '100%',
            }}>
                <div style={{
                    maxWidth: '1500px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
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
                                <span style={{ color: '#627084' }}>📞</span>
                                <span style={{ color: '#627084', fontWeight: '500' }}>+7 (495) 123-45-67</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                                <span style={{ color: '#627084' }}>✉️</span>
                                <span style={{ color: '#627084', fontWeight: '500' }}>info@eduplatform.ru</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                                <span style={{ color: '#627084' }}>📍</span>
                                <span style={{ color: '#627084', fontWeight: '500' }}>Москва, ул. Примерная, д. 1</span>
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
                                <span style={{ color: '#627084' }}>🕘</span>
                                <span style={{ color: '#627084', fontWeight: '500' }}>Поддержка: Пн-Пт, 9:00-18:00</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                                <span style={{ color: '#627084' }}>⏰</span>
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
                        fontSize: '14px'
                    }}>
                        © 2025 Платформа. Все права защищены.
                    </p>
                </div>
            </footer>
        </div>
        )
}

export default MainPage;