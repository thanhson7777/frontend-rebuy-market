import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/users/login`, data)
    return response.data.data || response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/users/logout`)
    if (showSuccessMessage) {
      toast.success('Đăng xuất thành công!')
    }
    return response.data.data || response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/users/update`, data)
    return response.data.data || response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload.data || action.payload

      state.currentUser = user

      if (user?.accessToken) {
        localStorage.setItem('accessToken', user.accessToken)
        if (user.refreshToken) {
          localStorage.setItem('refreshToken', user.refreshToken)
        }
      }
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    })

    builder.addCase(logoutUserAPI.rejected, (state) => {
      state.currentUser = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    })

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const updatedUser = action.payload.data || action.payload
      state.currentUser = { ...state.currentUser, ...updatedUser }
    })
  }
})

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer