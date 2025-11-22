import { setGame } from "../Features/game/gameSlice";
import { setAway, setHome } from "../Features/team/teamSlice";
import { setRosterAway, setRosterHome } from "../Features/roster/rosterSlice"
import store from "../Store/store";

const fetchSetData = async (game_id) => {
  const state = store.getState();
  const user = state?.user?.user;
  
  if (!user?.accessToken) {
    console.error("No user or access token found");
    return;
  }

  try {
    const res = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com/api/games/${game_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user.accessToken}`,
      }
    });

    if (!res.ok) throw new Error("Failed to fetch game");
    
    const data = await res.json();
    store.dispatch(setGame(data));
    return data;
  } catch (err) {
    console.error("Error fetching game:", err);
  }
};

const fetchTeam = async (team_id, type) => {
  const user = store.getState().user.user
  if (!team_id) {
    console.error("No team id provided")
    return;
  }

  try {
    const res = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com/api/teams/${team_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user.accessToken}`,
      }
    })

    if (!res.ok) throw new Error("Failed to fetch team with team id: " + team_id);
    const data = await res.json();
    if (type == "home") {
      store.dispatch(setHome(data));
    } else {
      store.dispatch(setAway(data));
    }
    return data;
  } catch (err) {
    console.error("Error fetching game:", err);
  }
}

const fetchRoster = async (team_id, type) => {
  const user = store.getState().user.user
  if (!team_id) {
    console.error("No team id provided")
    return;
  }

  try {
    const res = await fetch(`https://ec2-13-217-114-28.compute-1.amazonaws.com/api/teams/${team_id}/players`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user.accessToken}`,
      }
    })

    if (!res.ok) throw new Error("Failed to fetch roster with team id: " + team_id);
    const data = await res.json();
    if (type == "home") {
      store.dispatch(setRosterHome(data));
    } else {
      store.dispatch(setRosterAway(data));
    }
    return data;
  } catch (err) {
    console.error("Error fetching game:", err);
  }
}

const fetchRosterData = async () => {
  const state = store.getState();
  const homeTeamId = state.game.game.home_team_id
  const awayTeamId = state.game.game.away_team_id

  await fetchRoster(homeTeamId, "home")
  await fetchRoster(awayTeamId, "away")
}

const fetchTeamData = async () => {
  const state = store.getState();
  const homeTeamId = state.game.game.home_team_id
  const awayTeamId = state.game.game.away_team_id

  await fetchTeam(homeTeamId, "home")
  await fetchTeam(awayTeamId, "away")
}

export { fetchSetData, fetchTeamData, fetchRosterData };
