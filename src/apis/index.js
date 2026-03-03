import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/users/register`, data)
  toast.success('Tài khoản được tạo thành công! Vui lòng kiểm tra và xác minh tài khoản của bạn trước khi đăng nhập!', { theme: 'success' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/users/verify`, data)
  toast.success('Tài khoản được tạo thành công! Bây giờ bạn có thể đăng nhập để tận hưởng dịch vụ của mình!', { theme: 'success' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/users/refresh_token`)
  return response.data
}

export const fetchAdminUsersAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/users`, { params })
  return response.data
}

export const updateAdminUserRoleAPI = async (userId, data) => {
  const response = await authorizeAxiosInstance.patch(`${API_ROOT}/users/${userId}/status`, data)
  return response.data
}

// caregory
export const fetchAdminCategoriesAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/categories`)
  return response.data.data
}

export const createAdminCategoryAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/categories`, data)
  return response.data
}

export const updateAdminCategoryAPI = async (categoryId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/categories/${categoryId}`, data)
  return response.data
}

export const deleteAdminCategoryAPI = async (categoryId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/categories/${categoryId}`)
  return response.data
}

export const fetchCategoryAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/categories`)
  return response.data.data
}

// product
export const fetchAdminProductsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/products/admin`)
  return response.data
}

export const createAdminProductAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/products/admin`, data)
  return response.data
}

export const updateAdminProductAPI = async (productId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/products/${productId}`, data)
  return response.data
}

export const deleteAdminProductAPI = async (productId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/products/${productId}`)
  return response.data
}

export const fetchProductsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/products`)
  return response.data.data
}

export const fetchProductDetailAPI = async (productId) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/products/${productId}`)
  return response.data.data
}

// coupon
export const fetchAdminCouponsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/coupons`)
  return response.data
}

export const createAdminCouponAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/coupons`, data)
  return response.data
}

export const updateAdminCouponAPI = async (couponId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/coupons/${couponId}`, data)
  return response.data
}

export const deleteAdminCouponAPI = async (couponId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/coupons/${couponId}`)
  return response.data
}

export const fetchCouponsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/coupons/active`)
  return response.data.data
}

// order
export const fetchAdminOrdersAPI = async (params = {}) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/orders/admin`, { params })
  return response.data
}

export const updateAdminOrderStatusAPI = async (orderId, status) => {
  const response = await authorizeAxiosInstance.patch(`${API_ROOT}/${orderId}/status`, { status })
  return response.data
}

export const getOrdersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/orders/me`)
  return response.data.data
}

export const createOrderAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/orders`, data)
  return response.data
}

// article
export const fetchAdminArticlesAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/articles`)
  return response.data.data
}

export const createAdminArticleAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/articles`, data)
  return response.data
}

export const updateAdminArticleAPI = async (articleId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/articles/${articleId}`, data)
  return response.data
}

export const deleteAdminArticleAPI = async (articleId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/articles/${articleId}`)
  return response.data
}

// banner
export const fetchAdminBannersAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/banners`)
  return response.data.data
}

export const createAdminBannerAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/banners`, data)
  return response.data
}

export const updateAdminBannerAPI = async (bannerId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/banners/${bannerId}`, data)
  return response.data
}

export const deleteAdminBannerAPI = async (bannerId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/banners/${bannerId}`)
  return response.data
}

// contact
export const fetchAdminContactsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/contacts`)
  return response.data.data
}

export const updateAdminContactAPI = async (contactId, data) => {
  const response = await authorizeAxiosInstance.patch(`${API_ROOT}/contacts/${contactId}`, data)
  return response.data
}

export const deleteAdminContactAPI = async (contactId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/contacts/${contactId}`)
  return response.data
}
