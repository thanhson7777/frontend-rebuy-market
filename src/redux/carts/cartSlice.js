import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentCarts: null
}

export const fetchCartAPI = createAsyncThunk(
  'carts/fetchCartsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/cart`)
    return response.data.data || response.data
  }
)

export const updateCartAPI = createAsyncThunk(
  'carts/updateCartsAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/cart/update`, data)
    return response.data.data || response.data
  }
)

export const addToCartAPI = createAsyncThunk(
  'carts/addToCartAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/cart/add`, data)
    return response.data || response.data
  }
)

export const deleteItemCartAPI = createAsyncThunk(
  'carts/deleteItemCartAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/cart/remove-item`, { data })
    return response.data.data || response.data
  }
)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCurrentCarts: (state) => {
      state.currentCarts = null
    }
  },
  extraReducers: (builder) => {

    const updateCartState = (state, action) => {
      state.currentCarts = action.payload.data || action.payload
    }

    builder.addCase(fetchCartAPI.fulfilled, updateCartState)
    builder.addCase(updateCartAPI.fulfilled, updateCartState)
    builder.addCase(addToCartAPI.fulfilled, updateCartState)
    builder.addCase(deleteItemCartAPI.fulfilled, updateCartState)
  }
})

export const { clearCurrentCarts } = cartSlice.actions

export const selectCurrentCarts = (state) => state.cart.currentCarts

export const cartReducer = cartSlice.reducer