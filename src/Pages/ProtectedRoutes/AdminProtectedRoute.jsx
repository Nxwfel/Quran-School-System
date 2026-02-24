import { Navigate } from 'react-router-dom'

const AdminProtectedRoute = ({ children }) => {
  let role = null
  let token = null

  try {
    role = localStorage.getItem('role')
    token = localStorage.getItem('token')
  } catch {
    // localStorage unavailable
  }

  if (!token || role !== 'admin') {
    return <Navigate to='/adminlogin' replace />
  }

  return children
}

export default AdminProtectedRoute