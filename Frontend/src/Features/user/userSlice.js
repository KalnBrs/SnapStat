import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthZWxhbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MDgzODIyNiwiZXhwIjoxNzYwODQ5MDI2fQ.IHCqfWeJUV7IJaGnTGyoMvdErU3qDiW9Kzegc7MWQUo",
      username: "Kaelan",
      role: "admin"
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