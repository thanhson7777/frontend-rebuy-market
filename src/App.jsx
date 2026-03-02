import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { selectCurrentUser } from './redux/user/userSlice'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <div>hello</div>
  )
}

export default App