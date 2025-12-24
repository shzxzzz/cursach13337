import { Routes, Route, Link } from 'react-router-dom'
import MainPage from './pages/MainPage';
import CabinetPage from './pages/Cabinet';
import MorePage from './pages/More.jsx';
import LessonPage from './pages/Lesson.jsx';
import HomeWorkPage from './pages/HomeWork.jsx';
import './App.css'
import AdminPage from "./pages/Admin.jsx";
function App() {
    return (
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/cabinet/" element={<CabinetPage />} />
                <Route path="/course/:id" element={<MorePage />} />
                <Route path="/lesson/:lessonId" element={<LessonPage />} />
                <Route path="/homeworks/" element={<HomeWorkPage />} />
                <Route path="/adminka/" element={<AdminPage />} />
            </Routes>

    );
}

export default App