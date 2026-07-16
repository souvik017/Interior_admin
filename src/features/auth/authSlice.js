import { createSlice } from '@reduxjs/toolkit'

const AUTH_STORAGE_KEY = 'interior-admin-auth'

const initialAuth = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      status: 'idle',
    }
  }

  try {
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!saved) {
      return {
        user: null,
        token: null,
        status: 'idle',
      }
    }

    return {
      ...JSON.parse(saved),
      status: 'authenticated',
    }
  } catch {
    return {
      user: null,
      token: null,
      status: 'idle',
    }
  }
}

const persist = (state) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      token: state.token,
    }),
  )
}

const clear = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuth(),
  reducers: {
    loginSuccess: {
      reducer(state, action) {
        state.user = action.payload.user
        state.token = action.payload.token
        state.status = 'authenticated'
        persist(state)
      },
      prepare(payload) {
        return { payload }
      },
    },
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      clear()
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload }
      persist(state)
    },
  },
})

export const { loginSuccess, logout, updateProfile } = authSlice.actions
export const authReducer = authSlice.reducer
