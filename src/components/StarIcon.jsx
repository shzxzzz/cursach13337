import StarSvg from '/public/star-svgrepo-com.svg';

const StarIcon = () => {
    return (
        <img
            src={StarSvg}
            alt="star"
            style={{
                width: '20px',
                height: '20px',
                color: '#1162d4',
            }}
        />
    );
};

export default StarIcon;