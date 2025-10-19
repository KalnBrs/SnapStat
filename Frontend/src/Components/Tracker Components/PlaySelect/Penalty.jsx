import { useState } from "react";
import { setGame, setPenalty } from "../../../Features/game/gameSlice";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import {sendPen} from '../../../Scripts/sendPen'
import store from "../../../Store/store";

function Penalty({setFunc}) {
  const [autoFirst, setAutoFirst] = useState(false)

  const penNodes = useSelector(state => state.node.penaltyNode)

  const currentDistance = useSelector(state => state.game.game.distance)
  const currentDown = useSelector(state => state.game.game.down)
  const currentBallYard = useSelector(state => state.game.game.ball_on_yard)
  const game = useSelector(state => state.game.game)

  const dispatch = useDispatch()

  async function generatePen() {
    const penYards = (penNodes.End.x - 50) / 10 - (penNodes.Start.x - 50) / 10    
    if (autoFirst) {
      const response = await sendPen({down_to: 1, distance_to: 10, ball_on_yard: currentBallYard + penYards})

      dispatch(setGame({
        ...game,
        down: response.down,
        distance: response.distance,
        ball_on_yard: response.ball_on_yard
      }))
    } else {
      const response = await sendPen({down_to: currentDown, distance_to: currentDistance - penYards, ball_on_yard: currentBallYard + penYards})

      dispatch(setGame({
        ...game,
        down: response.down,
        distance: response.distance,
        ball_on_yard: response.ball_on_yard
      }))
    }

    
  }
  return (
    <>
      <div className="mt-3">
        <Button label={'Auto First Down'} onClick={() => setAutoFirst(true)} isActive={autoFirst} width={150} margin={0} />
        <div className='justify-center my-3'>
          <Button label={'Submit Penalty'} show={true} onClick={() => {generatePen(); dispatch(setPenalty(false)); setFunc(''); }} />
        </div>
      </div>
    </>
  )
}

export default Penalty