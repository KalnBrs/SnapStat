import store from "../Store/store";

async function getTeam(team_id) {
  const user = store.getState().user.user
  const response = await fetch(`http://localhost:8000/api/teams/${team_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!response.ok) {
    console.error("getTeam caused an error")
  }

  return await response.json();
}

async function getRoster(team_id) {
  const user = store.getState().user.user
  const response = await fetch(`http://localhost:8000/api/teams/${team_id}/players`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!response.ok) {
    console.error("getTeam caused an error")
  }

  return await response.json();
}

export { getTeam, getRoster }