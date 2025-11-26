import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Header.css';

function HeaderSection() {

    const navigate = useNavigate();

    const handleCabinetClick = () => {
        navigate('/cabinet/');
    }
    return (
        <div>
            <header>
                <Link to="/">
                    <div className="main_page"></div>
                </Link>

                <nav className ="menu">
                    <b>Курсы</b>
                    <b>О нас</b>
                    <b>Контакты</b>
                </nav>
                <div className="header-buttons">
                    <button className= "lk" onClick={ handleCabinetClick }>
                        Личный кабинет
                    </button>
                </div>


            </header>
        </div>


    );
}

export default HeaderSection;
