import store from "../Store/store";

async function sendPen({ distance_to, down_to, ball_on_yard }) {
  const gameState = store.getState().game.game
  const user = store.getState().user.user

  const response = await fetch(`http://ec2-13-217-114-28.compute-1.amazonaws.com:8000//api/games/${gameState.game_id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      distance: distance_to,
      down: down_to,
      ball_on_yard: ball_on_yard
    })
  })

  return await response.json()
}

export {sendPen}