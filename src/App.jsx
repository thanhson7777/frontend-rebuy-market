import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { selectCurrentUser } from './redux/user/userSlice'
import { useSelector } from 'react-redux'
import AdminLayout from './page/Admin/AdminLayout'
import CategoryLayout from './page/Admin/CategoryLayout'
import DashboardLayout from './page/Admin/DashboardLayout'
import ProductLayout from './page/Admin/ProductLayout'
import Auth from './page/Auth/Auth'
import CouponLayout from './page/Admin/CouponLayout'
import OrderLayout from './page/Admin/OrderLayout'
import UserLayout from './page/Admin/UserLayout'
import ArticleLayout from './page/Admin/ArticleLayout'
import BannerLayout from './page/Admin/BannerLayout'
import ContactLayout from './page/Admin/ContactLayout'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />} >
        <Route element={< ProtectedRoute user={currentUser} />} >
          <Route index element={<DashboardLayout />} />
          <Route path='categories' element={<CategoryLayout />} />
          <Route path='products' element={<ProductLayout />} />
          <Route path='coupons' element={<CouponLayout />} />
          <Route path='orders' element={<OrderLayout />} />
          <Route path='users' element={<UserLayout />} />
          <Route path='articles' element={<ArticleLayout />} />
          <Route path='banners' element={<BannerLayout />} />
          <Route path='contacts' element={<ContactLayout />} />

        </Route>
      </Route>

      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
    </Routes>
  )
}

export default App