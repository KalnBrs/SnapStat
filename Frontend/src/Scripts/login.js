import store from "../Store/store";
import { setAccessToken, setUser } from "../Features/user/userSlice";
import Error from "../Components/Error";

async function getGames() {
  const user = store.getState().user.user
  const response = await fetch(`http://localhost:8000/api/users/games`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!response.ok) {
    console.error("getGames caused an error")
  }

  return await response.json();
}

async function getTeams() {
  const user = store.getState().user.user
  const response = await fetch(`http://localhost:8000/api/users/teams`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!response.ok) {
    console.error("getGames caused an error")
  }

  return await response.json();
}

async function logIn(username, password) {
  const response = await fetch(`http://localhost:8000/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "username": username,
      "password": password
    })
  });

  if (response.status == 404) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

async function refreshToken() {
  const res = await fetch('http://localhost:8000/api/auth/refresh', {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  store.dispatch(setAccessToken(data.accessToken));

  const user = store.getState().user.user
  const res2 = await fetch (`http://localhost:8000/api/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`
    }
  })

  if (!res2.ok) {
    throw new Error('Getting uesr data failed');
  }

  const userData = await res2.json();
  store.dispatch(setUser(userData))
}

export { logIn, refreshToken, getGames, getTeams }