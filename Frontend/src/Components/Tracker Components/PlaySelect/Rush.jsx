import './PlaySelect.css';

import DropDown from './DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setReturn, setPenalty } from '../../../Features/game/gameSlice';
import Button from './Button';
import { setError } from '../../../Features/error/errorSlice';
import { calculateNextDownAndDistanceRush, runRush } from '../../../Scripts/sendRush';

function Rush({ setFunc }) {
  const [rbSelect, setRB] = useState();
  const [tackler, setTackler] = useState();
  const [isFumble, setIsFumble] = useState(false);
  const [fumbleRecoverer, setFumbleRecoverer] = useState();
  const [autoFirst, setAutoFirst] = useState(false);

  const [twoPtSucc, setTwoPtSucc] = useState(false)
  const [twoPtFail, setTwoPtFail] = useState(false)

  const homeRoster = useSelector(state => state.roster.home);
  const awayRoster = useSelector(state => state.roster.away);
  const offense = useSelector(state => state.game.offense);
  const retCondition = useSelector(state => state.game.return);
  const penCondition = useSelector(state => state.game.penalty);
  const dispatch = useDispatch();

  const options = offense === "home" ? homeRoster : awayRoster;
  const oppOption = offense === "home" ? awayRoster : homeRoster;

  const nodes = useSelector(state => state.node.offenseNode);
  const retNodes = useSelector(state => state.node.defenseNode);
  const penNodes = useSelector(state => state.node.penaltyNode);

  const currentDown = useSelector(state => state.game.game.down);
  const currentDistance = useSelector(state => state.game.game.distance);
  const currBallOnYard = useSelector(state => state.game.game.ball_on_yard)

  function setDefault() {
    dispatch(setReturn(false));
    dispatch(setPenalty(false));
    setAutoFirst(false);
    setIsFumble(false);
    setTackler(undefined);
    setFumbleRecoverer(undefined);
    setRB(undefined);
  }

  function generateRushPlay() {
    const startYard = (nodes.Start.x - 50) / 10;
    let endYardRush = !retCondition ? (nodes.End.x - 50) / 10 : (retNodes.End.x - 50) / 10;

    const penaltyYards = penCondition ? ((penNodes.End.x - 50) - (penNodes.Start.x - 50)) / 10 : 0;
    let endYardFinal = endYardRush;

    if (!rbSelect) {
      dispatch(setError({ show: true, message: "Please select an RB" }));
      return null;
    }

    // Player roles
    const players = [
      { player_id: rbSelect.player_id, role: "rusher", value: endYardRush - startYard },
    ];
    if (tackler) {
      players.push({ player_id: tackler.player_id, role: "tackler", value: 1 });
    }
    if (retCondition && fumbleRecoverer) {
      players.push({ player_id: fumbleRecoverer.player_id, role: "fumble_recoverer", value: 1 });
    } else if (retCondition) {
      dispatch(setError({ show: true, message: "Please select a fumble recoverer" }));
      return null;
    }

    // Result flags
    let result;
    let touchdown = false;
    let defenseScore = false;
    let touchback = false;
    let safety = false;
    let defSafety = false
    let playType = "rush";

    if (twoPtSucc) {
      result = "2pt_made"
    } else if (twoPtFail) {
      result = "2pt_missed"
    } else if (!retCondition && endYardFinal >= 100) {
      result = "Touchdown";
      touchdown = true;
      endYardFinal = 97;
    } else if (retCondition && (retNodes.End.x - 50) / 10 <= 0) {
      defenseScore = true;
      playType = "defense";
      result = "Scoop and Score";
      endYardFinal = 3;
    } else if (retCondition && (retNodes.Start.x - 50) / 10 < 100 && (retNodes.End.x - 50) / 10 >= 100 && !touchdown && !defenseScore) {
      console.log("Ran Def Saftey")
      result = "Def Safety";
      playType = "defense";
      defSafety = true;
      endYardFinal = 20;
    } else if (retCondition) {
      result = "Fumble";
    } else if (endYardFinal <= 0 && !touchdown && !defenseScore) {
      result = "Safety";
      playType = "defense";
      safety = true;
      endYardFinal = 20; // after safety kickoff spot
    } else {
      result = "Tackle";
    }
    if (retCondition && (retNodes.End.x - 50) / 10 >= 100) {
      touchback = true;
    }

    // Next down/distance
    const nextPlay = calculateNextDownAndDistanceRush(
      currentDown,
      currentDistance,
      startYard,
      endYardFinal,
      retCondition && !defenseScore,
      touchdown,
      touchback,
      defenseScore,
      autoFirst,
      penCondition,
      penaltyYards,
      safety,
      defSafety,
      result
    );

    console.log(nextPlay)

    return {
      type: playType,
      result,
      play_end: endYardRush,
      end_yard: endYardFinal,
      down_to: nextPlay.down_to,
      distance_to: nextPlay.distance_to,
      ball_on_yard: nextPlay.ball_on_yard,
      players,
      isTurnover: nextPlay.isTurnover,
      defSafety
    };
  }

  function handleSubmit() {
    const play = generateRushPlay();
    if (!play) return;
    runRush(play);
    setDefault();
    setFunc('');
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row my-5">
          <p className="self-center font-bold mx-3">RB: </p>
          <DropDown
            options={options.map(obj => ({
              ...obj,
              label: `#${obj.number} - ${obj.name}`,
              value: obj.player_id,
            }))}
            selectedValue={rbSelect}
            setSelect={setRB}
          />
          <div className="flex items-center justify-center mx-3">
            <Button
              label={"Fumble"}
              isActive={isFumble}
              onClick={() => {
                setIsFumble(!isFumble);
                dispatch(setReturn(!retCondition));
              }}
              width={200}
            />
            <Button
              label={"Penalty"}
              onClick={() => {
                dispatch(setPenalty(!penCondition));
                setAutoFirst(false);
              }}
              isActive={penCondition}
              width={100}
              margin={0}
            />
            {penCondition && (
              <Button
                label={"Auto First Down"}
                onClick={() => setAutoFirst(!autoFirst)}
                isActive={autoFirst}
                width={150}
                margin={0}
              />
            )}
            {currBallOnYard >= 95 && <> <Button label={'2pt Conversion Success'} onClick={() => setTwoPtSucc(true)} isActive={twoPtSucc} width={150} margin={0} /> <Button label={'2pt Conversion Failed'} onClick={() => setTwoPtFail(true)} isActive={twoPtFail} width={150} margin={0} /> </>}
            
          </div>
        </div>

        <div className="flex flex-row my-5">
          {!isFumble ? (
            <>
              <p className="self-center font-bold mx-3">Tackler: </p>
              <DropDown
                options={oppOption.map(obj => ({
                  ...obj,
                  label: `#${obj.number} - ${obj.name}`,
                  value: obj.player_id,
                }))}
                selectedValue={tackler}
                setSelect={setTackler}
              />
            </>
          ) : (
            <>
              <p className="self-center font-bold mx-3">Fumble Recoverer: </p>
              <DropDown
                options={oppOption.map(obj => ({
                  ...obj,
                  label: `#${obj.number} - ${obj.name}`,
                  value: obj.player_id,
                }))}
                selectedValue={fumbleRecoverer}
                setSelect={setFumbleRecoverer}
              />
            </>
          )}
        </div>
      </div>

      <div className="justify-center">
        <Button label={"Submit"} show={true} onClick={handleSubmit} />
      </div>
    </>
  );
}

export default Rush;
