
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TeachersPage from './pages/TeachersPage';
import CoursesPage from './pages/CoursesPage';
import ClassesPage from './pages/ClassesPage';
import RoomsPage from './pages/RoomsPage';
import TimetablePage from './pages/TimetablePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
      </Routes>
    </Router>
  );
}

export default App;
