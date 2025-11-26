import React from 'react';
import { Link } from 'react-scroll';
import '../styles/Courses.css';

const CoursesSection = () => {
    const courses = [
        {
            id: 1,
            name: "Управление проектами",
            description: "Освойте методологии управления проектами: Agile, Scrum, Kanban. Практические кейсы и инструменты.",
            duration: "8 недель",
            price: "49 900 ₽"
        },
        {
            id: 2,
            name: "Digital-маркетинг",
            description: "Полный курс по digital-маркетингу: SMM, контекстная реклама, SEO, аналитика и многое другое.",
            duration: "10 недель",
            price: "59 900 ₽"
        },
        {
            id: 3,
            name: "Веб-разработка",
            description: "Создание современных веб-приложений с использованием React, Node.js и современных инструментов.",
            duration: "12 недель",
            price: "69 900 ₽"
        },
        {
            id: 4,
            name: "Анализ данных",
            description: "Работа с большими данными, визуализация, статистический анализ, машинное обучение.",
            duration: "12 недель",
            price: "59 900 ₽"
        },
        {
            id: 5,
            name: "Тимбилдинг",
            description: "Развитие лидерских качеств, построение эффективных команд, мотивация сотрудников.",
            duration: "6 недель",
            price: "44 900 ₽"
        },
        {
            id: 6,
            name: "Финансовая грамотность",
            description: "Основы корпоративных финансов, бюджетирование, финансовый анализ и планирование.",
            duration: "8 недель",
            price: "49 900 ₽"
        },
    ];

    return (
        <section className="courses-section">
            <div className="courses-container">
                <h2 className="courses-title">Каталог курсов</h2>

                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
                            <h3 className="course-name">{course.name}</h3>

                            <p className="course-description">
                                {course.description}
                            </p>

                            <div className="course-info">
                                <div className="course-detail">
                                    <span className="course-detail-icon">⏱️</span>
                                    <span className="course-detail-text">{course.duration}</span>
                                </div>

                                <div className="course-detail">
                                    <span className="course-detail-icon">💰</span>
                                    <span className="course-detail-text">{course.price}</span>
                                </div>
                            </div>

                            <div className="course-buttons">
                                <button className="btn-details">Подробнее</button>
                                <button className="btn-enroll">Записаться</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;