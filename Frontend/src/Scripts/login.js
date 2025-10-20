import store from "../Store/store";

async function logIn(username, password) {
  const response = await fetch(`http://localhost:8000/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "username": username,
      "password": password
    })
  });

  console.log()

  if (response.status == 404) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

export {logIn}