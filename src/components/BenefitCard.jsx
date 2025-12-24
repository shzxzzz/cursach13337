import { Icon } from './Icons.jsx';

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

export default BenefitCard;