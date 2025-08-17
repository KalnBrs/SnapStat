import { useSelector } from "react-redux";

async function sendPass(end_yard, result, down_to, distance_to, players, type) {
  const gameState = useSelector(state => state.game.game)
  const response = await fetch(`http://localhost:8000/api/games/${gameState.game_id}/plays`, {
    method: "Post",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthZWxhbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjYzMzI3NiwiZXhwIjoxNzUyNjM1MDc2fQ.J0_RcXXp2MS0kuyU2uOVDWjLfhQQ2CO6ch083N4YIn0", 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "play_type": type, // Could be pass or defense depending on touchdown or not
        "start_yard": gameState.ball_on_yard,
        "end_yard": end_yard,
        "down": down_to, 
        "distance": distance_to,
        "ball_on": end_yard,
        "result": result,
        "possession_team_id": gameState.possession_team_id,
        "players": players
      })
    })

  return response
}

// Calculates the next down, distance, and ball position after a pass play
function calculateNextDownAndDistance(
  currentDown,
  currentDistance,
  startYard,
  endYard,
  turnover = false,
  touchdown = false,
  touchback = false,
  defenseScore = false
) {
  let down_to, distance_to, ball_on_yard;

  // 1. Defensive touchdown
  if (defenseScore) {
      down_to = 1;
      distance_to = 3;
      ball_on_yard = 97; // kickoff spot
      return { down_to, distance_to, ball_on_yard };
  }

  // 2. Touchback (interception/fumble return or end-zone play)
  if (touchback) {
      down_to = 1;
      distance_to = 10;
      ball_on_yard = 25; // league-specific
      return { down_to, distance_to, ball_on_yard };
  }

  // 3. Offensive touchdown
  if (touchdown) {
      down_to = 1;
      distance_to = 3;
      ball_on_yard = 97; // kickoff spot
      return { down_to, distance_to, ball_on_yard };
  }

  // 4. Turnover (non-scoring)
  if (turnover) {
      down_to = 1;
      distance_to = 10;
      ball_on_yard = 100 - endYard; 
      return { down_to, distance_to, ball_on_yard };
  }

  // 5. Normal progression
  const yardsGained = endYard - startYard;
  const yardsRemaining = currentDistance - yardsGained;

  if (yardsRemaining <= 0) {
      // First down achieved
      down_to = 1;
      distance_to = endYard >= 90 ? 100 - endYard : 10; // goal-to-go adjustment
  } else {
      down_to = currentDown + 1;
      distance_to = yardsRemaining;

      // Turnover on downs
      if (down_to > 4) {
          down_to = 1;
          distance_to = 10;
          ball_on_yard = 100 - endYard; // new offense takes over
          return { down_to, distance_to, ball_on_yard };
      }
  }

  ball_on_yard = endYard;
  return { down_to, distance_to, ball_on_yard };
}


export { sendPass, calculateNextDownAndDistance }