import { useState } from 'react';

import PlayerNode from '../PlayerNode';

import './Field.css'

const YARD_WIDTH = 10;  // 10px per yard
const ENDZONE_WIDTH = 50; // 5% of field width = 50px
const FIELD_WIDTH = 1100; // 100 yards * 10px + 2*50 endzones

function Field({ home_color, away_color, game_state, teams }) {
  const [nodes, setNodes] = useState({
    Start: {x: (game_state.ball_on_yard * YARD_WIDTH) + ENDZONE_WIDTH, y: 130},
    End: {x: (30 * YARD_WIDTH) + ENDZONE_WIDTH, y: 130}
  });
  const [retCondition, setRetCondition] = useState(false);
  const [retNodes, setRetNodes] = useState({
    Start: {x: nodes.End.x, y: nodes.End.y + 40},
    End: {x: nodes.Start.x, y: nodes.End.y + 40}
  });

  return (
    <>
      <div style={{ width: FIELD_WIDTH, position: 'relative' }}>
        <YardNumbers />
        <EndzonesField teams={teams}>
          <div
            className="line-of-scrimmage"
            style={{ left: `${(game_state.ball_on_yard * YARD_WIDTH) + ENDZONE_WIDTH}px` }}
          />
          <div
            className="first-down-line"
            style={{ left: `${(game_state.ball_on_yard + game_state.distance) * YARD_WIDTH + ENDZONE_WIDTH}px` }}
          />
          {Object.entries(nodes).map(([id, node]) => (
            <PlayerNode key={id} node={node} id={id} setNodes={setNodes} color={home_color} />
          ))}
          {retCondition && Object.entries(retNodes).map(([id, node]) => (
            <PlayerNode key={id} node={node} id={id} setNodes={setRetNodes} color={away_color} />
          ))}
        </EndzonesField>
      </div>
      <div className='flex '>
        <GainedInfo nodes={nodes} retNodes={retNodes} retCondition={retCondition} />
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

function EndzonesField({ children, teams }) {
  return (
    <div className="field" style={{ width: FIELD_WIDTH, height: '400px', position: 'relative' }}>
      <div className="endzone left-endzone" style={{ backgroundColor: teams.home_team.color }}><span className="endzone-label">{teams.home_team.abbreviation}</span></div>
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
      <div className="endzone right-endzone" style={{ backgroundColor: teams.away_team.color }}><span className="endzone-label">{teams.away_team.abbreviation}</span></div>
    </div>
  );
}

function GainedInfo({nodes, retNodes, retCondition}) {
  return (
    <>
      <p className='px-4.5 flex flex-col'><span className='font-bold'>Current Start Yard: </span> {(nodes.Start.x - 50) / 10}</p>
      <p className='px-4.5 flex flex-col'> <span className='font-bold'>Current End Yard: </span> {(nodes.End.x - 50) / 10}</p>
      <p className="px-4.5 flex flex-col"><span className="font-bold">Current Yards Gained: </span> {((nodes.End.x - 50) - (nodes.Start.x - 50)) / 10}</p>
      {retCondition ? (
      <>
        <p className="px-4.5 flex flex-col"><span className="font-bold">Return Start Yard: </span>{(retNodes.Start.x - 50) / 10}</p>
        <p className="px-4.5 flex flex-col"><span className="font-bold">Return End Yard: </span>{(retNodes.End.x - 50) / 10}</p>
        <p className="px-4.5 flex flex-col"><span className="font-bold">Return Yards Gained: </span>{((retNodes.End.x - 50) - (retNodes.Start.x - 50)) / 10}</p>
      </> ) : '' }
  </>
  )
}

export default Field;
