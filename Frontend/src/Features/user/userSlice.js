import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      accessToken: null,
      username: null,
      role: null,
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
      state.user = action.payload
    }
  } // kickoff_attempts kickoff_attemepts
})

export const { setAccessToken, setUsername, setRole, setUser } = userSlice.actions
export default userSlice.reducer