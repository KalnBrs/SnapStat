import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      accessToken: null,
      username: null,
      role: null,
      email: null,
      user_id: null
    }
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.user.accessToken = action.payload
    },
    setUsername: (state, action) => {
      state.user.username = action.payload
    },
    setRole: (state, action) => {
      state.user.role = action.payload
    },
    setUser: (state, action) => {
      state.user.username = action.payload.username
      state.user.role = action.payload.role
      state.user.email = action.payload.email
      state.user.user_id = action.payload.user_id
    }
  } 
})

export const { setAccessToken, setUsername, setRole, setUser } = userSlice.actions
export default userSlice.reducer