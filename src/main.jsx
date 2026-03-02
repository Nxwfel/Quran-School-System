import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// Public landing sections
import LandingPage from './Pages/LandingPage.jsx'
import About from './Pages/About.jsx'
import Schedule from './Pages/Schedule.jsx'
import Contact from './Pages/Contact.jsx'

// Auth pages
import TeacherAuthPage from './Pages/TeacherAuthPage.jsx'
import AdminAuth from './Pages/AdminAuthPage.jsx'
import ParentAuth from './Pages/ParentAuth.jsx'

// Dashboard pages
import AdminPage from './Pages/AdminPage.jsx'
import TeacherPage from './Pages/TeacherPage.jsx'
import ParentPage from './Pages/ParentPage.jsx'

// Protected route wrappers
import AdminProtectedRoute from './Pages/ProtectedRoutes/AdminProtectedRoute.jsx'
import TeacherProtectedRoute from './Pages/ProtectedRoutes/TeacherProtectedRoute.jsx'
import ParentProtectedRoute from './Pages/ProtectedRoutes/ParentProtectedRoute.jsx'

const Home = () => (
  <div className='min-h-screen w-screen overflow-x-hidden'>
    <LandingPage />
  </div>
)

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/adminlogin" element={<AdminAuth />} />
    <Route path="/teacherlogin" element={<TeacherAuthPage />} />
    <Route path="/parentlogin" element={<ParentAuth />} />

    <Route path="/admin" element={

      <AdminPage />

    } />

    <Route path="/teacher" element={
      <TeacherProtectedRoute>
        <TeacherPage />
      </TeacherProtectedRoute>
    } />

    <Route path="/parent" element={
      <ParentProtectedRoute>
        <ParentPage />
      </ParentProtectedRoute>
    } />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)