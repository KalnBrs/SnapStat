import store from "../Store/store";

async function getTeam(team_id) {
  const user = store.getState().user.user
  const response = await fetch(`http://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/teams/${team_id}`, {
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
  const response = await fetch(`http://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/teams/${team_id}/players`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
    }
  })

  if (!response.ok) {
    throw new Error("Get roster caused an error")
  }

  return await response.json();
}

async function getPlayerStats(player_id, game_id) {
  const user = store.getState().user.user;

  try {
    const response = await fetch(`http://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/stats/${player_id}/${game_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user.accessToken}`,
      }
    });

    if (response.status === 404) {
      console.log("No stats found for player");
      return; 
    }

    if (!response.ok) {
      console.error("getRosterStats caused an HTTP error");
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
  
    return await response.json();
    
  } catch (err) {
    console.log("An error occurred during the fetch operation:", err);
  }
}

export { getTeam, getRoster, getPlayerStats }