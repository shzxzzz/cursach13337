import { useState, useEffect, useCallback } from 'react';
import { Icon } from '../components/Icons.jsx';

const AdminPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [stats, setStats] = useState({
        totalCourses: 0,
        totalUsers: 0,
        totalHomeworks: 0,
        pendingHomeworks: 0
    });

    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [homeworkAssignments, setHomeworkAssignments] = useState([]);
    const [modules, setModules] = useState([]);
    const [lessons, setLessons] = useState([]);

    const [courseSearch, setCourseSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [moduleSearch, setModuleSearch] = useState('');
    const [lessonSearch, setLessonSearch] = useState('');
    const [homeworkSearch, setHomeworkSearch] = useState('');

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(courseSearch.toLowerCase())
    );

    const filteredUsers = users.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredModules = modules.filter(mod =>
        mod.title.toLowerCase().includes(moduleSearch.toLowerCase())
    );

    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(lessonSearch.toLowerCase())
    );

    const filteredHomeworkAssignments = homeworkAssignments.filter(hw =>
        hw.title.toLowerCase().includes(homeworkSearch.toLowerCase()) ||
        hw.description?.toLowerCase().includes(homeworkSearch.toLowerCase())
    );

    const [courseForm, setCourseForm] = useState({
        title: '',
        short_description: '',
        full_description: '',
        teacher_id: '',
        price: 0,
        duration: 4,
        student_count: 0,
        is_published: false,
        icon: 'project'
    });

    const [userForm, setUserForm] = useState({
        email: '',
        first_name: '',
        last_name: '',
        bio: '',
        role: 'teacher',
        experience_years: 0
    });

    const [moduleForm, setModuleForm] = useState({
        course_id: '',
        title: '',
        order_index: 1
    });

    const [lessonForm, setLessonForm] = useState({
        module_id: '',
        title: '',
        order_index: 1,
        description: '',
        video_url: ''
    });

    const [homeworkForm, setHomeworkForm] = useState({
        lesson_id: '',
        title: '',
        description: '',
        deadline_days: 7
    });

    const [editingCourse, setEditingCourse] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editingModule, setEditingModule] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [editingHomework, setEditingHomework] = useState(null);

    const [deleteCourseWithContent, setDeleteCourseWithContent] = useState(false);
    const [deleteModuleWithLessons, setDeleteModuleWithLessons] = useState(false);
    const [deleteLessonWithHomework, setDeleteLessonWithHomework] = useState(false);

    const [gradingHomework, setGradingHomework] = useState(null);
    const [gradeForm, setGradeForm] = useState({
        grade: 5,
        teacher_comment: ''
    });

    const apiRequest = useCallback(async (endpoint, options = {}) => {
        const url = `http://localhost:3000/api${endpoint}`;
        const token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const config = {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : null
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ошибка ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error.message);
            throw error;
        }
    }, []);

    const loadAllData = useCallback(async () => {
        try {
            setLoading(true);

            const [coursesData, usersData, homeworksData, modulesData, lessonsData, homeworkAssignmentsData] = await Promise.all([
                apiRequest('/courses'),
                apiRequest('/users'),
                apiRequest('/student-homeworks?status=submitted_for_review'),
                apiRequest('/modules'),
                apiRequest('/lessons'),
                apiRequest('/homework-assignments')
            ]);

            setCourses(coursesData || []);
            setUsers(usersData || []);
            setModules(modulesData || []);
            setLessons(lessonsData || []);
            setHomeworkAssignments(homeworkAssignmentsData || []);

            setStats({
                totalCourses: coursesData?.length || 0,
                totalUsers: usersData?.length || 0,
                totalHomeworks: homeworksData?.length || 0,
                pendingHomeworks: homeworksData?.filter(h => h.status === 'submitted_for_review')?.length || 0
            });

        } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    // создание курса
    const createCourse = async () => {
        try {
            const course = await apiRequest('/courses', {
                method: 'POST',
                body: courseForm
            });

            setCourses([...courses, course]);
            resetCourseForm();
            alert('Курс создан успешно!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // создание пользователя
    const createUser = async () => {
        try {
            // Для регистрации нужен пароль
            const userData = {
                ...userForm,
                password: 'password123' // Можно сделать поле для пароля
            };

            const user = await apiRequest('/users', {
                method: 'POST',
                body: userData
            });

            setUsers([...users, user]);
            resetUserForm();
            alert('Пользователь создан успешно!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // создание модуля
    const createModule = async () => {
        try {
            const module = await apiRequest('/modules', {
                method: 'POST',
                body: moduleForm
            });

            setModules([...modules, module]);
            resetModuleForm();
            alert('Модуль создан успешно!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // создание урока
    const createLesson = async () => {
        try {
            const lesson = await apiRequest('/lessons', {
                method: 'POST',
                body: lessonForm
            });

            setLessons([...lessons, lesson]);
            resetLessonForm();
            alert('Урок создан успешно!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // создание ДЗ
    const createHomework = async () => {
        try {
            const homework = await apiRequest('/homework-assignments', {
                method: 'POST',
                body: homeworkForm
            });

            setHomeworkAssignments([...homeworkAssignments, homework]);
            alert('Домашнее задание создано успешно!');
            resetHomeworkForm();
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // оценка дз
    const gradeHomework = async () => {
        try {
            await apiRequest(`/student-homeworks/${gradingHomework.id}`, {
                method: 'PUT',
                body: {
                    status: 'graded',
                    grade: gradeForm.grade,
                    teacher_comment: gradeForm.teacher_comment,
                    graded_at: new Date().toISOString()
                }
            });

            setGradingHomework(null);
            setGradeForm({ grade: 5, teacher_comment: '' });
            alert('Домашнее задание оценено!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // удаление курса с содержимым
    const deleteCourse = async (id) => {
        if (!confirm(deleteCourseWithContent
            ? 'Удалить курс вместе со всеми модулями и уроками?'
            : 'Удалить только курс (модули и уроки останутся)?')) return;

        try {
            if (deleteCourseWithContent) {
                // сначала найдем все модули
                const courseModules = modules.filter(m => m.course_id === id);

                // для каждого модуля удалим уроки и домашки
                for (const module of courseModules) {
                    const moduleLessons = lessons.filter(l => l.module_id === module.id);

                    // удаляем уроки и их домашук
                    for (const lesson of moduleLessons) {
                        // удаляем дз
                        const homework = homeworkAssignments.find(h => h.lesson_id === lesson.id);
                        if (homework) {
                            await apiRequest(`/homework-assignments/${homework.id}`, { method: 'DELETE' });
                        }
                        // удаляем урок
                        await apiRequest(`/lessons/${lesson.id}`, { method: 'DELETE' });
                    }

                    // удаляем модуль
                    await apiRequest(`/modules/${module.id}`, { method: 'DELETE' });
                }
            }

            // удаляем курс
            await apiRequest(`/courses/${id}`, { method: 'DELETE' });

            setCourses(courses.filter(c => c.id !== id));
            alert(deleteCourseWithContent ? 'Курс и все содержимое удалены' : 'Курс удален');
            setDeleteCourseWithContent(false);
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // удаление модуля с уроками
    const deleteModule = async (id) => {
        if (!confirm(deleteModuleWithLessons
            ? 'Удалить модуль вместе со всеми уроками?'
            : 'Удалить только модуль (уроки останутся)?')) return;

        try {
            if (deleteModuleWithLessons) {
                // находим все уроки этого модуля
                const moduleLessons = lessons.filter(l => l.module_id === id);

                // удаляем уроки и их дз
                for (const lesson of moduleLessons) {
                    // удаляем дз урока
                    const homework = homeworkAssignments.find(h => h.lesson_id === lesson.id);
                    if (homework) {
                        await apiRequest(`/homework-assignments/${homework.id}`, { method: 'DELETE' });
                    }
                    // удаляем урок
                    await apiRequest(`/lessons/${lesson.id}`, { method: 'DELETE' });
                }
            }

            // удаляем модуль
            await apiRequest(`/modules/${id}`, { method: 'DELETE' });

            setModules(modules.filter(m => m.id !== id));
            alert(deleteModuleWithLessons ? 'Модуль и все уроки удалены' : 'Модуль удален');
            setDeleteModuleWithLessons(false);
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // удаление урока с дз
    const deleteLesson = async (id) => {
        if (!confirm(deleteLessonWithHomework
            ? 'Удалить урок вместе с домашним заданием?'
            : 'Удалить только урок (ДЗ останется)?')) return;

        try {
            if (deleteLessonWithHomework) {
                // нахожу дз урока
                const homework = homeworkAssignments.find(h => h.lesson_id === id);
                if (homework) {
                    await apiRequest(`/homework-assignments/${homework.id}`, { method: 'DELETE' });
                }
            }

            // удаляем урок
            await apiRequest(`/lessons/${id}`, { method: 'DELETE' });

            setLessons(lessons.filter(l => l.id !== id));
            alert(deleteLessonWithHomework ? 'Урок и ДЗ удалены' : 'Урок удален');
            setDeleteLessonWithHomework(false);
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // удаление домашнего задания
    const deleteHomework = async (id) => {
        if (!confirm('Удалить домашнее задание?')) return;

        try {
            await apiRequest(`/homework-assignments/${id}`, { method: 'DELETE' });
            setHomeworkAssignments(homeworkAssignments.filter(h => h.id !== id));
            alert('Домашнее задание удалено');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // удаление пользователя
    const deleteUser = async (id) => {
        if (!confirm('Удалить пользователя?')) return;

        try {
            await apiRequest(`/users/${id}`, { method: 'DELETE' });
            setUsers(users.filter(u => u.id !== id));
            alert('Пользователь удален');
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // обновление статуса курса
    const toggleCoursePublish = async (course) => {
        try {
            await apiRequest(`/courses/${course.id}`, {
                method: 'PUT',
                body: { ...course, is_published: !course.is_published }
            });

            setCourses(courses.map(c =>
                c.id === course.id
                    ? { ...c, is_published: !c.is_published }
                    : c
            ));

            alert(`Курс ${!course.is_published ? 'опубликован' : 'скрыт'}!`);
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    // сброс форм
    const resetCourseForm = () => {
        setCourseForm({
            title: '',
            short_description: '',
            full_description: '',
            teacher_id: '',
            price: 0,
            duration: 4,
            student_count: 0,
            is_published: false,
            icon: 'project'
        });
        setEditingCourse(null);
    };

    const resetUserForm = () => {
        setUserForm({
            email: '',
            first_name: '',
            last_name: '',
            bio: '',
            role: 'teacher',
            experience_years: 0
        });
        setEditingUser(null);
    };

    const resetModuleForm = () => {
        setModuleForm({
            course_id: '',
            title: '',
            order_index: 1
        });
        setEditingModule(null);
    };

    const resetLessonForm = () => {
        setLessonForm({
            module_id: '',
            title: '',
            order_index: 1,
            description: '',
            video_url: ''
        });
        setEditingLesson(null);
    };

    const resetHomeworkForm = () => {
        setHomeworkForm({
            lesson_id: '',
            title: '',
            description: '',
            deadline_days: 7
        });
        setEditingHomework(null);
    };

    // заполнение форм для редактирования
    const editCourse = (course) => {
        setCourseForm({
            title: course.title,
            short_description: course.short_description || '',
            full_description: course.full_description || '',
            teacher_id: course.teacher_id,
            price: course.price,
            duration: course.duration,
            student_count: course.student_count || 0,
            is_published: course.is_published || false,
            icon: course.icon || 'project'
        });
        setEditingCourse(course.id);
        setActiveTab('courses');
    };

    const editUser = (user) => {
        setUserForm({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            bio: user.bio || '',
            role: user.role,
            experience_years: user.experience_years || 0
        });
        setEditingUser(user.id);
        setActiveTab('users');
    };

    const editModule = (module) => {
        setModuleForm({
            course_id: module.course_id,
            title: module.title,
            order_index: module.order_index
        });
        setEditingModule(module.id);
        setActiveTab('modules');
    };

    const editLesson = (lesson) => {
        setLessonForm({
            module_id: lesson.module_id,
            title: lesson.title,
            order_index: lesson.order_index,
            description: lesson.description || '',
            video_url: lesson.video_url || ''
        });
        setEditingLesson(lesson.id);
        setActiveTab('lessons');
    };

    const editHomework = (homework) => {
        setHomeworkForm({
            lesson_id: homework.lesson_id,
            title: homework.title,
            description: homework.description,
            deadline_days: homework.deadline_days
        });
        setEditingHomework(homework.id);
        setActiveTab('homeworks');
    };

    // обновление
    const updateCourse = async () => {
        try {
            await apiRequest(`/courses/${editingCourse}`, {
                method: 'PUT',
                body: courseForm
            });

            resetCourseForm();
            alert('Курс обновлен!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const updateUser = async () => {
        try {
            await apiRequest(`/users/${editingUser}`, {
                method: 'PUT',
                body: userForm
            });

            resetUserForm();
            alert('Пользователь обновлен!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const updateModule = async () => {
        try {
            await apiRequest(`/modules/${editingModule}`, {
                method: 'PUT',
                body: moduleForm
            });

            resetModuleForm();
            alert('Модуль обновлен!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const updateLesson = async () => {
        try {
            await apiRequest(`/lessons/${editingLesson}`, {
                method: 'PUT',
                body: lessonForm
            });

            resetLessonForm();
            alert('Урок обновлен!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const updateHomework = async () => {
        try {
            await apiRequest(`/homework-assignments/${editingHomework}`, {
                method: 'PUT',
                body: homeworkForm
            });

            resetHomeworkForm();
            alert('Домашнее задание обновлено!');
            loadAllData();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#fff'
            }}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #1a79ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p style={{ color: '#627084', fontSize: '18px' }}>Загрузка админ-панели...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#fff',
                padding: '20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '500px',
                    padding: '40px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '12px',
                    backgroundColor: '#fff5f5'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ff6b6b',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <Icon name="warning" size={30} color="#fff" />
                    </div>
                    <h3 style={{ color: '#d32f2f', marginBottom: '15px' }}>Ошибка загрузки</h3>
                    <p style={{ color: '#627084', marginBottom: '25px' }}>{error}</p>
                    <button
                        onClick={loadAllData}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#1a79ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '80px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        marginBottom: '10px',
                        color: '#263140',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <Icon name="settings" size={32} color="#1a79ff" />
                        Админ-панель
                    </h1>
                    <p style={{ color: '#627084', fontSize: '16px' }}>
                        Управление курсами, пользователями и проверка домашних заданий
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    borderBottom: '1px solid #e9ecef',
                    paddingBottom: '10px'
                }}>
                    {['dashboard', 'courses', 'users', 'modules', 'lessons', 'homeworks', 'check-homework'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: activeTab === tab ? '#1a79ff' : '#f8f9fa',
                                border: 'none',
                                color: activeTab === tab ? '#fff' : '#263140',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {tab === 'dashboard' && 'Дашборд'}
                            {tab === 'courses' && 'Курсы'}
                            {tab === 'users' && 'Пользователи'}
                            {tab === 'modules' && 'Модули'}
                            {tab === 'lessons' && 'Уроки'}
                            {tab === 'homeworks' && 'Домашние задания'}
                            {tab === 'check-homework' && 'Проверка ДЗ'}
                        </button>
                    ))}
                </div>

                <div>
                    {/* дэшборд */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                marginBottom: '20px',
                                color: '#263140'
                            }}>
                                Статистика
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '20px',
                                marginBottom: '30px'
                            }}>
                                {[
                                    {
                                        label: 'Всего курсов',
                                        value: stats.totalCourses,
                                        icon: 'project',
                                        color: '#1a79ff'
                                    },
                                    {
                                        label: 'Всего пользователей',
                                        value: stats.totalUsers,
                                        icon: 'users',
                                        color: '#22C55E'
                                    },
                                    {
                                        label: 'Всего ДЗ',
                                        value: stats.totalHomeworks,
                                        icon: 'assignment',
                                        color: '#F59E0B'
                                    },
                                    {
                                        label: 'ДЗ на проверке',
                                        value: stats.pendingHomeworks,
                                        icon: 'clock',
                                        color: '#EF4444'
                                    }
                                ].map((item, index) => (
                                    <div key={index} style={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                        transition: 'all 0.3s ease'
                                    }}
                                         onMouseEnter={(e) => {
                                             e.currentTarget.style.transform = 'translateY(-5px)';
                                             e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                         }}
                                         onMouseLeave={(e) => {
                                             e.currentTarget.style.transform = 'translateY(0)';
                                             e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                                         }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '10px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#627084'
                                            }}>
                                                {item.label}
                                            </div>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: item.color + '20',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Icon name={item.icon} size={20} color={item.color} />
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '28px',
                                            fontWeight: '700',
                                            color: '#263140'
                                        }}>
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                backgroundColor: '#fff',
                                border: '1px solid #e9ecef',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    marginBottom: '15px',
                                    color: '#263140'
                                }}>
                                    Быстрые действия
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={() => setActiveTab('courses')}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#1a79ff',
                                            border: 'none',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Добавить курс
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#22C55E',
                                            border: 'none',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Добавить преподавателя
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('check-homework')}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#F59E0B',
                                            border: 'none',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Проверить ДЗ
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '30px'
                            }}>
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <h2 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#263140'
                                    }}>
                                        {editingCourse ? 'Редактировать курс' : 'Создать курс'}
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Название курса *</label>
                                            <input
                                                type="text"
                                                value={courseForm.title}
                                                onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Введите название курса"
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Краткое описание *</label>
                                            <textarea
                                                value={courseForm.short_description}
                                                onChange={(e) => setCourseForm({...courseForm, short_description: e.target.value})}
                                                rows={3}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Краткое описание для карточки курса"
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Полное описание</label>
                                            <textarea
                                                value={courseForm.full_description}
                                                onChange={(e) => setCourseForm({...courseForm, full_description: e.target.value})}
                                                rows={5}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Полное подробное описание курса"
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Преподаватель *</label>
                                            <select
                                                value={courseForm.teacher_id}
                                                onChange={(e) => setCourseForm({...courseForm, teacher_id: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                <option value="">Выберите преподавателя</option>
                                                {users.filter(u => u.role === 'teacher').map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.first_name} {user.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '20px'
                                        }}>
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    color: '#627084',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>Цена (₽) *</label>
                                                <input
                                                    type="number"
                                                    value={courseForm.price}
                                                    onChange={(e) => setCourseForm({...courseForm, price: parseFloat(e.target.value) || 0})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="0"
                                                    min="0"
                                                    step="100"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    color: '#627084',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>Длительность (недель) *</label>
                                                <input
                                                    type="number"
                                                    value={courseForm.duration}
                                                    onChange={(e) => setCourseForm({...courseForm, duration: parseInt(e.target.value) || 4})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="4"
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '20px'
                                        }}>
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    color: '#627084',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>Количество студентов</label>
                                                <input
                                                    type="number"
                                                    value={courseForm.student_count}
                                                    onChange={(e) => setCourseForm({...courseForm, student_count: parseInt(e.target.value) || 0})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="0"
                                                    min="0"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    color: '#627084',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>Иконка</label>
                                                <select
                                                    value={courseForm.icon}
                                                    onChange={(e) => setCourseForm({...courseForm, icon: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                >
                                                    <option value="project">📁 Проект</option>
                                                    <option value="code">💻 Программирование</option>
                                                    <option value="design">🎨 Дизайн</option>
                                                    <option value="analytics">📊 Аналитика</option>
                                                    <option value="marketing">📈 Маркетинг</option>
                                                    <option value="leadership">👨‍💼 Лидерство</option>
                                                    <option value="certificate">📜 Сертификат</option>
                                                    <option value="mentor">👨‍🏫 Ментор</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <input
                                                type="checkbox"
                                                id="is_published"
                                                checked={courseForm.is_published}
                                                onChange={(e) => setCourseForm({...courseForm, is_published: e.target.checked})}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            <label htmlFor="is_published" style={{
                                                color: '#627084',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}>
                                                Опубликовать курс (будет виден на сайте)
                                            </label>
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {editingCourse ? (
                                                <>
                                                    <button
                                                        onClick={updateCourse}
                                                        style={{
                                                            flex: 1,
                                                            padding: '14px',
                                                            backgroundColor: '#1a79ff',
                                                            border: 'none',
                                                            color: '#fff',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Обновить курс
                                                    </button>
                                                    <button
                                                        onClick={resetCourseForm}
                                                        style={{
                                                            padding: '14px 24px',
                                                            backgroundColor: '#f8f9fa',
                                                            border: '1px solid #e9ecef',
                                                            color: '#263140',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Отмена
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={createCourse}
                                                    style={{
                                                        flex: 1,
                                                        padding: '14px',
                                                        backgroundColor: '#1a79ff',
                                                        border: 'none',
                                                        color: '#fff',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    Создать курс
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* список курсов */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px',
                                        gap: '15px'
                                    }}>
                                        <h2 style={{
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            color: '#263140',
                                            margin: 0
                                        }}>
                                            Все курсы ({filteredCourses.length})
                                        </h2>
                                        <div style={{ position: 'relative', width: '300px' }}>
                                            <input
                                                type="text"
                                                placeholder="Поиск по названию курса..."
                                                value={courseSearch}
                                                onChange={(e) => setCourseSearch(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 15px 10px 40px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                <Icon name="search" size={18} color="#627084" />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        marginBottom: '15px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id="deleteCourseWithContent"
                                            checked={deleteCourseWithContent}
                                            onChange={(e) => setDeleteCourseWithContent(e.target.checked)}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        <label htmlFor="deleteCourseWithContent" style={{
                                            fontSize: '14px',
                                            color: '#627084',
                                            cursor: 'pointer'
                                        }}>
                                            При удалении курса также удалять все модули и уроки
                                        </label>
                                    </div>

                                    <div style={{
                                        maxHeight: '600px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        {filteredCourses.map(course => {
                                            const teacher = users.find(u => u.id === course.teacher_id);
                                            const courseModules = modules.filter(m => m.course_id === course.id);
                                            const totalLessons = lessons.filter(l =>
                                                courseModules.some(m => m.id === l.module_id)
                                            ).length;

                                            return (
                                                <div key={course.id} style={{
                                                    backgroundColor: '#fff',
                                                    border: `1px solid ${course.is_published ? '#22C55E30' : '#e9ecef'}`,
                                                    borderRadius: '10px',
                                                    padding: '18px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: '12px'
                                                    }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                marginBottom: '8px'
                                                            }}>
                                                                <Icon name={course.icon || 'project'} size={20} color="#1a79ff" />
                                                                <div style={{
                                                                    fontSize: '16px',
                                                                    fontWeight: '600',
                                                                    color: '#263140'
                                                                }}>
                                                                    {course.title}
                                                                </div>
                                                                <div style={{
                                                                    fontSize: '12px',
                                                                    color: course.is_published ? '#22C55E' : '#F59E0B',
                                                                    backgroundColor: course.is_published ? '#22C55E20' : '#F59E0B20',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '4px',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}>
                                                                    <Icon name={course.is_published ? 'check' : 'clock'} size={12} />
                                                                    {course.is_published ? 'Опубликован' : 'Не опубликован'}
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '14px',
                                                                color: '#627084',
                                                                marginBottom: '10px',
                                                                lineHeight: '1.5'
                                                            }}>
                                                                {course.short_description?.substring(0, 120)}...
                                                            </div>
                                                            <div style={{
                                                                fontSize: '12px',
                                                                color: '#1a79ff',
                                                                marginBottom: '5px'
                                                            }}>
                                                                Преподаватель: {teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Не указан'}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                                                            <button
                                                                onClick={() => toggleCoursePublish(course)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: course.is_published ? '#f8f9fa' : '#1a79ff10',
                                                                    border: `1px solid ${course.is_published ? '#e9ecef' : '#1a79ff'}`,
                                                                    color: course.is_published ? '#627084' : '#1a79ff',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                <Icon name={course.is_published ? 'eye-off' : 'eye'} size={12} />
                                                                {course.is_published ? 'Скрыть' : 'Опубликовать'}
                                                            </button>
                                                            <button
                                                                onClick={() => editCourse(course)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: '#f8f9fa',
                                                                    border: '1px solid #1a79ff',
                                                                    color: '#1a79ff',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Icon name="edit" size={12} />
                                                                Редактировать
                                                            </button>
                                                            <button
                                                                onClick={() => deleteCourse(course.id)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: '#fff5f5',
                                                                    border: '1px solid #ff6b6b',
                                                                    color: '#ff6b6b',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Icon name="delete" size={12} />
                                                                Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '20px',
                                                        fontSize: '13px',
                                                        color: '#627084',
                                                        borderTop: '1px solid #f0f0f0',
                                                        paddingTop: '12px',
                                                        marginTop: '12px'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Icon name="dollar" size={14} color="#22C55E" />
                                                            <span>{course.price ? `${course.price} ₽` : 'Бесплатно'}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Icon name="calendar" size={14} color="#1a79ff" />
                                                            <span>{course.duration} недель</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Icon name="users" size={14} color="#F59E0B" />
                                                            <span>{course.student_count || 0} студентов</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Icon name="book" size={14} color="#8B5CF6" />
                                                            <span>{courseModules.length} модулей, {totalLessons} уроков</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* пользователи */}
                    {activeTab === 'users' && (
                        <div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '30px'
                            }}>
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <h2 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#263140'
                                    }}>
                                        {editingUser ? 'Редактировать пользователя' : 'Создать пользователя'}
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Email *</label>
                                            <input
                                                type="email"
                                                value={userForm.email}
                                                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="email@example.com"
                                            />
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '20px'
                                        }}>
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    color: '#627084',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>Имя *</label>
                                                <input
                                                    type="text"
                                                    value={userForm.first_name}
                                                    onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="Имя"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    color: '#627084',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>Фамилия *</label>
                                                <input
                                                    type="text"
                                                    value={userForm.last_name}
                                                    onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="Фамилия"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Описание (Bio)</label>
                                            <textarea
                                                value={userForm.bio}
                                                onChange={(e) => setUserForm({...userForm, bio: e.target.value})}
                                                rows={4}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Краткое описание пользователя..."
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Роль</label>
                                            <select
                                                value={userForm.role}
                                                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                <option value="teacher">Преподаватель</option>
                                                <option value="student">Студент</option>
                                                <option value="admin">Администратор</option>
                                            </select>
                                        </div>

                                        {userForm.role === 'teacher' && (
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    color: '#627084',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>Опыт работы (лет)</label>
                                                <input
                                                    type="number"
                                                    value={userForm.experience_years}
                                                    onChange={(e) => setUserForm({...userForm, experience_years: parseInt(e.target.value) || 0})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="0"
                                                    min="0"
                                                />
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {editingUser ? (
                                                <>
                                                    <button
                                                        onClick={updateUser}
                                                        style={{
                                                            flex: 1,
                                                            padding: '14px',
                                                            backgroundColor: '#1a79ff',
                                                            border: 'none',
                                                            color: '#fff',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Обновить
                                                    </button>
                                                    <button
                                                        onClick={resetUserForm}
                                                        style={{
                                                            padding: '14px 24px',
                                                            backgroundColor: '#f8f9fa',
                                                            border: '1px solid #e9ecef',
                                                            color: '#263140',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Отмена
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={createUser}
                                                    style={{
                                                        flex: 1,
                                                        padding: '14px',
                                                        backgroundColor: '#1a79ff',
                                                        border: 'none',
                                                        color: '#fff',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    Создать пользователя
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* список пользователей */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px',
                                        gap: '15px'
                                    }}>
                                        <h2 style={{
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            color: '#263140',
                                            margin: 0
                                        }}>
                                            Все пользователи ({filteredUsers.length})
                                        </h2>
                                        <div style={{ position: 'relative', width: '300px' }}>
                                            <input
                                                type="text"
                                                placeholder="Поиск по имени, фамилии или email..."
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 15px 10px 40px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                <Icon name="search" size={18} color="#627084" />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        maxHeight: '600px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        {filteredUsers.map(user => (
                                            <div key={user.id} style={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '10px',
                                                padding: '18px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    marginBottom: '12px'
                                                }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            marginBottom: '8px'
                                                        }}>
                                                            <div style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                backgroundColor: user.role === 'teacher' ? '#1a79ff20' :
                                                                    user.role === 'admin' ? '#EF444420' : '#22C55E20',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <Icon
                                                                    name="user"
                                                                    size={18}
                                                                    color={user.role === 'teacher' ? '#1a79ff' :
                                                                        user.role === 'admin' ? '#EF4444' : '#22C55E'}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div style={{
                                                                    fontSize: '16px',
                                                                    fontWeight: '600',
                                                                    color: '#263140'
                                                                }}>
                                                                    {user.first_name} {user.last_name}
                                                                </div>
                                                                <div style={{
                                                                    fontSize: '14px',
                                                                    color: '#627084'
                                                                }}>
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '12px',
                                                                color: user.role === 'teacher' ? '#1a79ff' :
                                                                    user.role === 'admin' ? '#EF4444' : '#22C55E',
                                                                backgroundColor: user.role === 'teacher' ? '#1a79ff20' :
                                                                    user.role === 'admin' ? '#EF444420' : '#22C55E20',
                                                                padding: '2px 8px',
                                                                borderRadius: '4px'
                                                            }}>
                                                                {user.role === 'teacher' ? 'Преподаватель' :
                                                                    user.role === 'admin' ? 'Администратор' : 'Студент'}
                                                            </div>
                                                        </div>
                                                        {user.bio && (
                                                            <div style={{
                                                                fontSize: '14px',
                                                                color: '#627084',
                                                                marginBottom: '10px',
                                                                lineHeight: '1.5',
                                                                fontStyle: 'italic'
                                                            }}>
                                                                "{user.bio.substring(0, 100)}"
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                                                        <button
                                                            onClick={() => editUser(user)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: '#f8f9fa',
                                                                border: '1px solid #1a79ff',
                                                                color: '#1a79ff',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                        >
                                                            <Icon name="edit" size={12} />
                                                            Редактировать
                                                        </button>
                                                        {user.role !== 'admin' && (
                                                            <button
                                                                onClick={() => deleteUser(user.id)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: '#fff5f5',
                                                                    border: '1px solid #ff6b6b',
                                                                    color: '#ff6b6b',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Icon name="delete" size={12} />
                                                                Удалить
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {user.experience_years > 0 && (
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#627084',
                                                        borderTop: '1px solid #f0f0f0',
                                                        paddingTop: '12px',
                                                        marginTop: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}>
                                                        <Icon name="graduation" size={14} color="#1a79ff" />
                                                        <span>Опыт работы: {user.experience_years} лет</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* модули */}
                    {activeTab === 'modules' && (
                        <div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '30px'
                            }}>
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <h2 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#263140'
                                    }}>
                                        {editingModule ? 'Редактировать модуль' : 'Создать модуль'}
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Курс *</label>
                                            <div style={{ position: 'relative' }}>
                                                <select
                                                    value={moduleForm.course_id}
                                                    onChange={(e) => setModuleForm({...moduleForm, course_id: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box',
                                                        appearance: 'none',
                                                        background: 'white'
                                                    }}
                                                >
                                                    <option value="">Выберите курс</option>
                                                    {courses.map(course => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none'
                                                }}>
                                                    <Icon name="chevron" size={16} color="#627084" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Название модуля *</label>
                                            <input
                                                type="text"
                                                value={moduleForm.title}
                                                onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Введите название модуля"
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Порядковый номер</label>
                                            <input
                                                type="number"
                                                value={moduleForm.order_index}
                                                onChange={(e) => setModuleForm({...moduleForm, order_index: parseInt(e.target.value) || 1})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {editingModule ? (
                                                <>
                                                    <button
                                                        onClick={updateModule}
                                                        style={{
                                                            flex: 1,
                                                            padding: '14px',
                                                            backgroundColor: '#1a79ff',
                                                            border: 'none',
                                                            color: '#fff',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Обновить модуль
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            resetModuleForm();
                                                            setEditingModule(null);
                                                        }}
                                                        style={{
                                                            padding: '14px 24px',
                                                            backgroundColor: '#f8f9fa',
                                                            border: '1px solid #e9ecef',
                                                            color: '#263140',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Отмена
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={createModule}
                                                    style={{
                                                        flex: 1,
                                                        padding: '14px',
                                                        backgroundColor: '#1a79ff',
                                                        border: 'none',
                                                        color: '#fff',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    Создать модуль
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* список модулей */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px',
                                        gap: '15px'
                                    }}>
                                        <h2 style={{
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            color: '#263140',
                                            margin: 0
                                        }}>
                                            Все модули ({filteredModules.length})
                                        </h2>
                                        <div style={{ position: 'relative', width: '300px' }}>
                                            <input
                                                type="text"
                                                placeholder="Поиск по названию модуля..."
                                                value={moduleSearch}
                                                onChange={(e) => setModuleSearch(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 15px 10px 40px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                <Icon name="search" size={18} color="#627084" />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        marginBottom: '15px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id="deleteModuleWithLessons"
                                            checked={deleteModuleWithLessons}
                                            onChange={(e) => setDeleteModuleWithLessons(e.target.checked)}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        <label htmlFor="deleteModuleWithLessons" style={{
                                            fontSize: '14px',
                                            color: '#627084',
                                            cursor: 'pointer'
                                        }}>
                                            При удалении модуля также удалять все уроки
                                        </label>
                                    </div>

                                    <div style={{
                                        maxHeight: '600px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        {filteredModules.map(mod => {
                                            const course = courses.find(c => c.id === mod.course_id);
                                            const moduleLessons = lessons.filter(l => l.module_id === mod.id);
                                            const moduleHomework = homeworkAssignments.filter(h =>
                                                moduleLessons.some(l => l.id === h.lesson_id)
                                            );

                                            return (
                                                <div key={mod.id} style={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '10px',
                                                    padding: '18px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: '12px'
                                                    }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{
                                                                fontSize: '16px',
                                                                fontWeight: '600',
                                                                color: '#263140',
                                                                marginBottom: '6px'
                                                            }}>
                                                                {mod.title}
                                                            </div>
                                                            <div style={{
                                                                fontSize: '14px',
                                                                color: '#627084',
                                                                marginBottom: '10px'
                                                            }}>
                                                                Курс: {course ? course.title : 'Неизвестный курс'}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                                                            <button
                                                                onClick={() => editModule(mod)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: '#f8f9fa',
                                                                    border: '1px solid #1a79ff',
                                                                    color: '#1a79ff',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Icon name="edit" size={12} />
                                                                Редактировать
                                                            </button>
                                                            <button
                                                                onClick={() => deleteModule(mod.id)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: '#fff5f5',
                                                                    border: '1px solid #ff6b6b',
                                                                    color: '#ff6b6b',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Icon name="delete" size={12} />
                                                                Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        fontSize: '13px',
                                                        color: '#627084',
                                                        borderTop: '1px solid #f0f0f0',
                                                        paddingTop: '12px',
                                                        marginTop: '12px'
                                                    }}>
                                                        <div style={{ display: 'flex', gap: '15px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <Icon name="book" size={14} color="#1a79ff" />
                                                                <span>{moduleLessons.length} уроков</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <Icon name="assignment" size={14} color="#F59E0B" />
                                                                <span>{moduleHomework.length} заданий</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Icon name="list" size={14} color="#8B5CF6" />
                                                            <span>Порядок: {mod.order_index}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* уроки */}
                    {activeTab === 'lessons' && (
                        <div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '30px'
                            }}>
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <h2 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#263140'
                                    }}>
                                        {editingLesson ? 'Редактировать урок' : 'Создать урок'}
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Модуль *</label>
                                            <div style={{ position: 'relative' }}>
                                                <select
                                                    value={lessonForm.module_id}
                                                    onChange={(e) => setLessonForm({...lessonForm, module_id: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box',
                                                        appearance: 'none',
                                                        background: 'white'
                                                    }}
                                                >
                                                    <option value="">Выберите модуль</option>
                                                    {modules.map(mod => {
                                                        const course = courses.find(c => c.id === mod.course_id);
                                                        return (
                                                            <option key={mod.id} value={mod.id}>
                                                                {mod.title} ({course ? course.title : 'Без курса'})
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <div style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none'
                                                }}>
                                                    <Icon name="chevron" size={16} color="#627084" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Название урока *</label>
                                            <input
                                                type="text"
                                                value={lessonForm.title}
                                                onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Введите название урока"
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Описание урока</label>
                                            <textarea
                                                value={lessonForm.description}
                                                onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})}
                                                rows={4}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Описание содержания урока..."
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>URL видео</label>
                                            <input
                                                type="text"
                                                value={lessonForm.video_url}
                                                onChange={(e) => setLessonForm({...lessonForm, video_url: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="https://youtube.com/..."
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Порядковый номер</label>
                                            <input
                                                type="number"
                                                value={lessonForm.order_index}
                                                onChange={(e) => setLessonForm({...lessonForm, order_index: parseInt(e.target.value) || 1})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {editingLesson ? (
                                                <>
                                                    <button
                                                        onClick={updateLesson}
                                                        style={{
                                                            flex: 1,
                                                            padding: '14px',
                                                            backgroundColor: '#1a79ff',
                                                            border: 'none',
                                                            color: '#fff',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Обновить урок
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            resetLessonForm();
                                                            setEditingLesson(null);
                                                        }}
                                                        style={{
                                                            padding: '14px 24px',
                                                            backgroundColor: '#f8f9fa',
                                                            border: '1px solid #e9ecef',
                                                            color: '#263140',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Отмена
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={createLesson}
                                                    style={{
                                                        flex: 1,
                                                        padding: '14px',
                                                        backgroundColor: '#1a79ff',
                                                        border: 'none',
                                                        color: '#fff',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    Создать урок
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* список уроков */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px',
                                        gap: '15px'
                                    }}>
                                        <h2 style={{
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            color: '#263140',
                                            margin: 0
                                        }}>
                                            Все уроки ({filteredLessons.length})
                                        </h2>
                                        <div style={{ position: 'relative', width: '300px' }}>
                                            <input
                                                type="text"
                                                placeholder="Поиск по названию или описанию..."
                                                value={lessonSearch}
                                                onChange={(e) => setLessonSearch(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 15px 10px 40px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                <Icon name="search" size={18} color="#627084" />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        marginBottom: '15px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id="deleteLessonWithHomework"
                                            checked={deleteLessonWithHomework}
                                            onChange={(e) => setDeleteLessonWithHomework(e.target.checked)}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        <label htmlFor="deleteLessonWithHomework" style={{
                                            fontSize: '14px',
                                            color: '#627084',
                                            cursor: 'pointer'
                                        }}>
                                            При удалении урока также удалять домашнее задание
                                        </label>
                                    </div>

                                    <div style={{
                                        maxHeight: '600px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        {filteredLessons.map(lesson => {
                                            const module = modules.find(m => m.id === lesson.module_id);
                                            const course = module ? courses.find(c => c.id === module.course_id) : null;
                                            const lessonHomework = homeworkAssignments.find(h => h.lesson_id === lesson.id);

                                            return (
                                                <div key={lesson.id} style={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '10px',
                                                    padding: '18px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: '12px'
                                                    }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{
                                                                fontSize: '16px',
                                                                fontWeight: '600',
                                                                color: '#263140',
                                                                marginBottom: '6px'
                                                            }}>
                                                                {lesson.title}
                                                            </div>
                                                            {lesson.description && (
                                                                <div style={{
                                                                    fontSize: '14px',
                                                                    color: '#627084',
                                                                    marginBottom: '10px',
                                                                    lineHeight: '1.4'
                                                                }}>
                                                                    {lesson.description.substring(0, 120)}...
                                                                </div>
                                                            )}
                                                            <div style={{
                                                                fontSize: '13px',
                                                                color: '#627084'
                                                            }}>
                                                                {course && <span style={{ marginRight: '10px' }}>📚 {course.title}</span>}
                                                                {module && <span>📂 {module.title}</span>}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                                                            <button
                                                                onClick={() => editLesson(lesson)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: '#f8f9fa',
                                                                    border: '1px solid #1a79ff',
                                                                    color: '#1a79ff',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Icon name="edit" size={12} />
                                                                Редактировать
                                                            </button>
                                                            <button
                                                                onClick={() => deleteLesson(lesson.id)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    backgroundColor: '#fff5f5',
                                                                    border: '1px solid #ff6b6b',
                                                                    color: '#ff6b6b',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                            >
                                                                <Icon name="delete" size={12} />
                                                                Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        fontSize: '13px',
                                                        color: '#627084',
                                                        borderTop: '1px solid #f0f0f0',
                                                        paddingTop: '12px',
                                                        marginTop: '12px'
                                                    }}>
                                                        <div style={{ display: 'flex', gap: '15px' }}>
                                                            {lesson.video_url && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <Icon name="play" size={14} color="#EF4444" />
                                                                    <span>Есть видео</span>
                                                                </div>
                                                            )}
                                                            {lessonHomework && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <Icon name="assignment" size={14} color="#F59E0B" />
                                                                    <span>Есть ДЗ</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Icon name="list" size={14} color="#8B5CF6" />
                                                            <span>Порядок: {lesson.order_index}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* дз */}
                    {activeTab === 'homeworks' && (
                        <div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '30px'
                            }}>
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <h2 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#263140'
                                    }}>
                                        {editingHomework ? 'Редактировать задание' : 'Создать домашнее задание'}
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Урок *</label>
                                            <div style={{ position: 'relative' }}>
                                                <select
                                                    value={homeworkForm.lesson_id}
                                                    onChange={(e) => setHomeworkForm({...homeworkForm, lesson_id: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box',
                                                        appearance: 'none',
                                                        background: 'white'
                                                    }}
                                                >
                                                    <option value="">Выберите урок</option>
                                                    {lessons.map(lesson => {
                                                        const module = modules.find(m => m.id === lesson.module_id);
                                                        const course = module ? courses.find(c => c.id === module.course_id) : null;
                                                        return (
                                                            <option key={lesson.id} value={lesson.id}>
                                                                {lesson.title} ({course ? course.title : 'Без курса'})
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <div style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none'
                                                }}>
                                                    <Icon name="chevron" size={16} color="#627084" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Название задания *</label>
                                            <input
                                                type="text"
                                                value={homeworkForm.title}
                                                onChange={(e) => setHomeworkForm({...homeworkForm, title: e.target.value})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Введите название задания"
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Описание задания *</label>
                                            <textarea
                                                value={homeworkForm.description}
                                                onChange={(e) => setHomeworkForm({...homeworkForm, description: e.target.value})}
                                                rows={6}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Подробное описание задания для студентов..."
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Дней на выполнение</label>
                                            <input
                                                type="number"
                                                value={homeworkForm.deadline_days}
                                                onChange={(e) => setHomeworkForm({...homeworkForm, deadline_days: parseInt(e.target.value) || 7})}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="7"
                                                min="1"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {editingHomework ? (
                                                <>
                                                    <button
                                                        onClick={updateHomework}
                                                        style={{
                                                            flex: 1,
                                                            padding: '14px',
                                                            backgroundColor: '#1a79ff',
                                                            border: 'none',
                                                            color: '#fff',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Обновить задание
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            resetHomeworkForm();
                                                            setEditingHomework(null);
                                                        }}
                                                        style={{
                                                            padding: '14px 24px',
                                                            backgroundColor: '#f8f9fa',
                                                            border: '1px solid #e9ecef',
                                                            color: '#263140',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '15px'
                                                        }}
                                                    >
                                                        Отмена
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={createHomework}
                                                    style={{
                                                        flex: 1,
                                                        padding: '14px',
                                                        backgroundColor: '#1a79ff',
                                                        border: 'none',
                                                        color: '#fff',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    Создать задание
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* список дз */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px',
                                        gap: '15px'
                                    }}>
                                        <h2 style={{
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            color: '#263140',
                                            margin: 0
                                        }}>
                                            Все домашние задания ({filteredHomeworkAssignments.length})
                                        </h2>
                                        <div style={{ position: 'relative', width: '300px' }}>
                                            <input
                                                type="text"
                                                placeholder="Поиск по названию или описанию..."
                                                value={homeworkSearch}
                                                onChange={(e) => setHomeworkSearch(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 15px 10px 40px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                left: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                <Icon name="search" size={18} color="#627084" />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        maxHeight: '600px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        {filteredHomeworkAssignments.length === 0 ? (
                                            <div style={{
                                                padding: '40px',
                                                textAlign: 'center',
                                                color: '#627084',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '10px',
                                                border: '1px dashed #e9ecef'
                                            }}>
                                                <Icon name="assignment" size={48} color="#627084" style={{ marginBottom: '15px' }} />
                                                <h3 style={{ color: '#263140', marginBottom: '10px' }}>Нет домашних заданий</h3>
                                                <p>Создайте первое домашнее задание</p>
                                            </div>
                                        ) : (
                                            filteredHomeworkAssignments.map(homework => {
                                                const lesson = lessons.find(l => l.id === homework.lesson_id);
                                                const module = lesson ? modules.find(m => m.id === lesson.module_id) : null;
                                                const course = module ? courses.find(c => c.id === module.course_id) : null;

                                                return (
                                                    <div key={homework.id} style={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #e9ecef',
                                                        borderRadius: '10px',
                                                        padding: '18px',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'flex-start',
                                                            marginBottom: '12px'
                                                        }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{
                                                                    fontSize: '16px',
                                                                    fontWeight: '600',
                                                                    color: '#263140',
                                                                    marginBottom: '8px'
                                                                }}>
                                                                    {homework.title}
                                                                </div>
                                                                <div style={{
                                                                    fontSize: '14px',
                                                                    color: '#627084',
                                                                    marginBottom: '10px',
                                                                    lineHeight: '1.5'
                                                                }}>
                                                                    {homework.description?.substring(0, 120)}...
                                                                </div>
                                                                <div style={{
                                                                    fontSize: '13px',
                                                                    color: '#627084'
                                                                }}>
                                                                    {course && <span style={{ marginRight: '10px' }}>📚 {course.title}</span>}
                                                                    {module && <span style={{ marginRight: '10px' }}>📂 {module.title}</span>}
                                                                    {lesson && <span>📖 {lesson.title}</span>}
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                                                                <button
                                                                    onClick={() => editHomework(homework)}
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        backgroundColor: '#f8f9fa',
                                                                        border: '1px solid #1a79ff',
                                                                        color: '#1a79ff',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '12px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px'
                                                                    }}
                                                                >
                                                                    <Icon name="edit" size={12} />
                                                                    Редактировать
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteHomework(homework.id)}
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        backgroundColor: '#fff5f5',
                                                                        border: '1px solid #ff6b6b',
                                                                        color: '#ff6b6b',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '12px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px'
                                                                    }}
                                                                >
                                                                    <Icon name="delete" size={12} />
                                                                    Удалить
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            fontSize: '13px',
                                                            color: '#627084',
                                                            borderTop: '1px solid #f0f0f0',
                                                            paddingTop: '12px',
                                                            marginTop: '12px'
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <Icon name="clock" size={14} color="#F59E0B" />
                                                                <span>Срок выполнения: {homework.deadline_days} дней</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <Icon name="link" size={14} color="#1a79ff" />
                                                                <span>Урок ID: {homework.lesson_id}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* проверка домашек */}
                    {activeTab === 'check-homework' && (
                        <div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                marginBottom: '20px',
                                color: '#263140'
                            }}>
                                Проверка домашних заданий ({stats.pendingHomeworks})
                            </h2>

                            {gradingHomework ? (
                                <div style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <h3 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        marginBottom: '20px',
                                        color: '#263140'
                                    }}>
                                        Оценивание домашнего задания
                                    </h3>

                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #e9ecef',
                                            borderRadius: '8px',
                                            padding: '15px',
                                            marginBottom: '15px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#627084',
                                                marginBottom: '5px'
                                            }}>
                                                Ответ студента:
                                            </div>
                                            <div style={{
                                                color: '#263140',
                                                lineHeight: '1.5',
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {gradingHomework.text_answer}
                                            </div>
                                            {gradingHomework.file_url && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <a
                                                        href={gradingHomework.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: '#1a79ff',
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px'
                                                        }}
                                                    >
                                                        <Icon name="download" size={14} />
                                                        Прикрепленный файл
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Оценка (1-5)</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setGradeForm({...gradeForm, grade: num})}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: gradeForm.grade === num ? '#1a79ff' : '#f8f9fa',
                                                            border: `1px solid ${gradeForm.grade === num ? '#1a79ff' : '#e9ecef'}`,
                                                            color: gradeForm.grade === num ? '#fff' : '#263140',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: '8px',
                                                color: '#627084',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>Комментарий преподавателя</label>
                                            <textarea
                                                value={gradeForm.teacher_comment}
                                                onChange={(e) => setGradeForm({...gradeForm, teacher_comment: e.target.value})}
                                                rows={4}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Ваш комментарий к работе студента..."
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button
                                                onClick={gradeHomework}
                                                style={{
                                                    flex: 1,
                                                    padding: '14px',
                                                    backgroundColor: '#22C55E',
                                                    border: 'none',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                Отправить оценку
                                            </button>
                                            <button
                                                onClick={() => setGradingHomework(null)}
                                                style={{
                                                    padding: '14px 24px',
                                                    backgroundColor: '#f8f9fa',
                                                    border: '1px solid #e9ecef',
                                                    color: '#263140',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                    gap: '20px'
                                }}>
                                    {stats.pendingHomeworks === 0 ? (
                                        <div style={{
                                            gridColumn: '1 / -1',
                                            padding: '40px',
                                            textAlign: 'center',
                                            color: '#627084',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '12px',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <Icon name="assignment" size={48} color="#627084" style={{ marginBottom: '15px' }} />
                                            <h3 style={{ color: '#263140', marginBottom: '10px' }}>Нет заданий на проверку</h3>
                                            <p>Все домашние задания проверены</p>
                                        </div>
                                    ) : (
                                        <div style={{
                                            gridColumn: '1 / -1',
                                            padding: '40px',
                                            textAlign: 'center',
                                            color: '#627084'
                                        }}>
                                            <Icon name="assignment" size={48} color="#627084" style={{ marginBottom: '15px' }} />
                                            <h3 style={{ color: '#263140', marginBottom: '10px' }}>Задания на проверку загружаются</h3>
                                            <p>Используется endpoint: /student-homeworks?status=submitted_for_review</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;