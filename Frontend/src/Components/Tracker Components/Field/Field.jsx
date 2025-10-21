import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import PlayerNode from '../../Tracker Components/PlayerNode';

import './Field.css'
import { useSelector, useDispatch } from 'react-redux';
import { setDefault } from '../../../Features/node/nodeSlice';
import { fetchRosterData, fetchSetData, fetchTeamData } from '../../../Scripts/fieldApi';

const YARD_WIDTH = 10;  // 10px per yard
const ENDZONE_WIDTH = 50; // 5% of field width = 50px
const FIELD_WIDTH = 1100; // 100 yards * 10px + 2*50 endzones

function Field() {
  const game_state = useSelector(state => state.game.game)
  const nodes = useSelector(state => state.node.offenseNode)
  const retNodes = useSelector(state => state.node.defenseNode)
  const penNodes = useSelector(state => state.node.penaltyNode)
  const retCondition = useSelector(state => state.game.return)
  const penCondition = useSelector(state => state.game.penalty)
  const team = useSelector(state => state.team)


  const { gameID } = useParams();

  const dispatch = useDispatch()

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!gameID) return;
    const init = async () => {
      await fetchSetData(gameID);
      await fetchTeamData();
      await fetchRosterData();
    };
    init();
  }, [gameID, dispatch]);

  useEffect(() => {
    if (!initialized && game_state?.ball_on_yard !== undefined) {
      dispatch(setDefault({
        ballOnYard: game_state.ball_on_yard,
        yardWidth: YARD_WIDTH,
        endzoneWidth: ENDZONE_WIDTH
      }));
      setInitialized(true);
    }
  }, [game_state.ball_on_yard, initialized, dispatch]);

  if (!game_state?.ball_on_yard || (!team?.home && !team?.away)) return <p>Loading field...</p>;

  return (
    <>
      <div style={{ width: FIELD_WIDTH, position: 'relative' }}>
        <YardNumbers />
        <EndzonesField>
          <div
            className="line-of-scrimmage"
            style={{ left: `${(game_state.ball_on_yard * YARD_WIDTH) + ENDZONE_WIDTH}px` }}
          />
          <div
            className="first-down-line"
            style={{ left: `${(game_state.ball_on_yard + game_state.distance) * YARD_WIDTH + ENDZONE_WIDTH}px` }}
          />
          {initialized && Object.entries(nodes).map(([id, node]) => {
            return <PlayerNode key={id} type={"off"} node={node} id={id} pos_team_id={game_state.possession_team_id} />
          })}
          {retCondition && initialized && Object.entries(retNodes).map(([id, node]) => {
            return <PlayerNode key={id} type={"def"} node={node} id={id} pos_team_id={game_state.possession_team_id} />
          })}
          {penCondition && initialized && Object.entries(penNodes).map(([id, node]) => (
            <PlayerNode key={id} type={"pen"} node={node} id={id}  pos_team_id={game_state.possession_team_id}/>
          ))}
        </EndzonesField>
      </div>
      <div className='flex '>
        <GainedInfo />
      </div>
    </>
  );
}

function YardNumbers() {
  return (
    <div className="yard-numbers-overlay">
      {Array.from({ length: 101 }, (_, i) => (
        i % 10 === 0 ? (
          <div key={i} className="yard-number-abs" style={{ left: `${i * YARD_WIDTH}px` }}>
            {50 - Math.abs(50 - i)}
          </div>
        ) : null
      ))}
    </div>
  );
}

function EndzonesField({ children }) {
  const teams = useSelector(state => state.team)
  return (
    <div className="field" style={{ width: FIELD_WIDTH, height: '400px', position: 'relative' }}>
      <div className="endzone left-endzone" style={{ backgroundColor: teams.home?.color }}><span className="endzone-label">{teams.home?.abbreviation}</span></div>
      {Array.from({ length: 100 }, (_, i) => (
        <div key={i} className={`yard ${i % 10 === 0 ? 'ten' : i % 5 === 0 ? 'five' : ''}`}>
          {!(i % 10 === 0 || i % 5 === 0) &&
            <>
              <div className="hash left-hash" />
              <div className="hash right-hash" />
            </>
          }
        </div>
      ))}
      {children}
      <div className="endzone right-endzone" style={{ backgroundColor: teams.away?.color }}><span className="endzone-label">{teams.away?.abbreviation}</span></div>
    </div>
  );
}

function GainedInfo() {
  const retCondition = useSelector(state => state.game.return)
  const penCondition = useSelector(state => state.game.penalty)
  const nodes = useSelector(state => state.node.offenseNode)
  const retNodes = useSelector(state => state.node.defenseNode)
  const penNodes = useSelector(state => state.node.penaltyNode)

  return (
    <>
      <p className='px-4.5 flex flex-col'><span className='font-bold'>Current Start Yard: </span> {(nodes.Start.x - 50) / 10}</p>
      <p className='px-4.5 flex flex-col'> <span className='font-bold'>Current End Yard: </span> {(nodes.End.x - 50) / 10}</p>
      <p className="px-4.5 flex flex-col"><span className="font-bold">Current Yards Gained: </span> {((nodes.End.x - 50) - (nodes.Start.x - 50)) / 10}</p>
      {retCondition ? (
      <>
        <p className="px-4.5 flex flex-col"><span className="font-bold">Return Start Yard: </span>{(retNodes.Start.x - 50) / 10}</p>
        <p className="px-4.5 flex flex-col"><span className="font-bold">Return End Yard: </span>{(retNodes.End.x - 50) / 10}</p>
        <p className="px-4.5 flex flex-col"><span className="font-bold">Return Yards Gained: </span>
        {((retNodes.Start.x - 50) - (retNodes.End.x - 50)) / 10}</p>
      </> ) : '' }
      {penCondition ? (
        <> 
          <p className='px-4.5 flex flex-col'><span className='font-bold'>Penalty Start Yard: </span> {(penNodes.Start.x - 50) / 10}</p>
          <p className='px-4.5 flex flex-col'> <span className='font-bold'>Penalty End Yard: </span> {(penNodes.End.x - 50) / 10}</p>
          <p className="px-4.5 flex flex-col"><span className="font-bold">Penalty Yards Gained: </span> {((penNodes.End.x - 50) - (penNodes.Start.x - 50)) / 10}</p>
        </>
      ) : ''}
  </>
  )
}

export default Field;
