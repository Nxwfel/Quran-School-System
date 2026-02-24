import { Navigate } from 'react-router-dom'

const ParentProtectedRoute = ({ children }) => {
  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    user = null
  }

  if (!user || user.role !== 'parent' || !user.token) {
    return <Navigate to='/parentlogin' replace />
  }

  return children
}

export default ParentProtectedRoute