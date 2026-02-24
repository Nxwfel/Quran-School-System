import { Navigate } from 'react-router-dom'

const TeacherProtectedRoute = ({ children }) => {
  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    user = null
  }

  if (!user || user.role !== 'teacher' || !user.token) {
    return <Navigate to='/teacherlogin' replace />
  }

  return children
}

export default TeacherProtectedRoute