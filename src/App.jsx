import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { selectCurrentUser } from './redux/user/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
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
import MainLayout from './components/MainLayout/MainLayout'
import HomePage from './page/Hompage/Homepage'
import BlogPage from './page/Blog/Blog'
import BlogDetail from './page/Blog/BlogDetail'
import ContactPage from './page/Contact/Contact'
import CartPage from './page/Cart/Cart'
import CheckoutPage from './page/Checkout/Checkout'
import OrderSuccessPage from './page/OrderSuccess/OrderSuccess'
import ProductsPage from './page/Products/Products'
import ProductDetail from './page/ProductDetail/ProductDetail'
import { fetchCartAPI } from './redux/carts/cartSlice'
import OrderHistory from './page/OrderHistory/OrderHistory'
import Profile from './page/Profile/Profile'
import AccountVerifycation from './page/Auth/Verify'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCartAPI())
    }
  }, [currentUser, dispatch])

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

      <Route element={<MainLayout />} >
        <Route index element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/my-orders" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/verify" element={<AccountVerifycation />} />
    </Routes>
  )
}

export default App