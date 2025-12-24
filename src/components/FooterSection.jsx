import { Icon } from './Icons.jsx';

const FooterSection = () => {
    return (
        <footer id="footer-section" style={{
            padding: '60px 20px 30px',
            backgroundColor: '#f3f4f7',
            width: '100%',
        }}>
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
        </footer>
    );
};

export default FooterSection;