import store from "../Store/store"

async function getTeam(team_id) {
  const user = store.getState().user.user
  const result = await fetch(`http://localhost:8000/api/teams/${team_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!result.ok) {
    console.error("HTTP request did not work")
  }

  return await result.json();
}

export { getTeam }