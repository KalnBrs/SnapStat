import store from "../Store/store"

async function postTeam(team) {
  const user = store.getState().user.user;
  const res = await fetch(`http://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/teams/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team)
  })

  if (!res.ok) {
    throw new Error("Error getting team")
  }

  return await res.json();
}

async function clearTeam(team) {
  const user = store.getState().user.user;
  const res = await fetch(`http://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/teams/${team.team_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error("Error clearing team")
  }
}

async function updateTeam(data, team) {
  const user = store.getState().user.user;
  const res = await fetch(`http://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/teams/${team.team_id}`, {
    method: "PATCH",
    credentials: 'include',
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    },
    body: data
  })

  if (!res.ok) {
    throw new Error("Error updating team")
  }

  return await res.json();
}

export { postTeam, updateTeam, clearTeam }