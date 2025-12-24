import { Icon } from './Icons.jsx';

const CourseCard = ({
                        course,
                        isHovered,
                        onHover,
                        onDetailsClick,
                        onEnrollClick,
                        isEnrolling = false      
                    }) => {
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
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '250px',
                maxHeight: '300px'
            }}
            onMouseEnter={() => !isEnrolling && onHover(course.id)}
            onMouseLeave={() => !isEnrolling && onHover(null)}
        >
            {     }
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
                marginBottom: '12px',
                color: '#263140',
                textAlign: 'left',
                position: 'relative',
                zIndex: 2,
                lineHeight: '1.3',
                minHeight: '52px'
            }}>
                {course.name}
            </h3>

            {     }
            <div style={{
                flex: '1 1 auto',
                marginBottom: '15px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <p style={{
                    color: '#627084',
                    lineHeight: '1.5',
                    textAlign: 'left',
                    fontSize: '14px',
                    position: 'relative',
                    zIndex: 2,
                    margin: 0,
                    maxHeight: '60px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {course.description}
                </p>
            </div>

            {     }
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                alignItems: 'center',
                textAlign: 'left',
                position: 'relative',
                zIndex: 2,
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="book" size={16} color={isHovered ? "#1a79ff" : "#627084"} />
                    <span style={{
                        color: '#263140',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'color 0.3s ease'
                    }}>
                        {course.lessons}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="clock" size={16} color={isHovered ? "#1a79ff" : "#627084"} />
                    <span style={{
                        color: '#263140',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'color 0.3s ease'
                    }}>
                        {course.duration}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="users" size={16} color={isHovered ? "#1a79ff" : "#627084"} />
                    <span style={{
                        color: '#263140',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'color 0.3s ease'
                    }}>
                        {course.students}
                    </span>
                </div>
            </div>

            {     }
            <div style={{
                display: 'flex',
                gap: '10px',
                position: 'relative',
                zIndex: 2,
                marginTop: 'auto',
                flexShrink: 0
            }}>
                <button
                    onClick={onDetailsClick}
                    disabled={isEnrolling}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: `1px solid ${isHovered ? '#1a79ff' : '#1a79ff'}`,
                        color: isHovered ? '#fff' : '#1a79ff',
                        borderRadius: '8px',
                        cursor: isEnrolling ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        backgroundColor: isHovered ? '#1a79ff' : 'transparent',
                        height: '40px',
                        opacity: isEnrolling ? 0.6 : 1
                    }}
                >
                    Подробнее
                </button>
                <button
                    onClick={onEnrollClick}
                    disabled={isEnrolling}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        backgroundColor: isHovered && !isEnrolling ? '#1565d8' : '#1a79ff',
                        border: `1px solid ${isHovered && !isEnrolling ? '#1565d8' : '#1a79ff'}`,
                        color: '#fff',
                        borderRadius: '8px',
                        cursor: isEnrolling ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        transform: isHovered && !isEnrolling ? 'scale(1.05)' : 'scale(1)',
                        height: '40px',
                        opacity: isEnrolling ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    {isEnrolling ? (
                        <>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #fff',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            Записываем...
                        </>
                    ) : (
                        'Записаться'
                    )}
                </button>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CourseCard;