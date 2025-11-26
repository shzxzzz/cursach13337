import { Routes, Route, Link } from 'react-router-dom'
import MainPage from './pages/MainPage';
import CabinetPage from './pages/Cabinet';
import './App.css'
function App() {
    return (
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/cabinet/" element={<CabinetPage />} />
            </Routes>
    );
}

export default App