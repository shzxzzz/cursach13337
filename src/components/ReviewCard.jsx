import { useState } from 'react';
import { Icon } from './Icons.jsx';

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

export default ReviewCard;