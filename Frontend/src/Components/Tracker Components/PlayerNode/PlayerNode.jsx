import './PlayerNode.css';
import Draggable from 'react-draggable';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDefenseNode, setOffenseNode, setPenaltyNode } from '../../../Features/node/nodeSlice';

const ENDZONE_WIDTH = 50;
const YARD_WIDTH = 10;

const PlayerNode = ({ type, id, node, pos_team_id }) => {
  const nodeRef = useRef(null); 
  const dispatch = useDispatch()
  const team = useSelector(state => state.team)
  let color = team.home.team_id == pos_team_id ? team.home.color : team.away.color
  if (type == "pen") {
    color = "yellow"
  }
  else if (type == "off") {
    if (team.home.team_id == pos_team_id) {
      color = team.home.color
    } else {
      color = team.away.color
    }
  } else {
    if (team.home.team_id == pos_team_id) {
      color = team.away.color
    } else {
      color = team.home.color
    }
  }
  // if type is off + home team and possesion id same : home 
  // if type is def + home team and possesion id same : away 

  const nodeFunc = type === "off" ? setOffenseNode : type === "def" ? setDefenseNode : setPenaltyNode

  const handleDrag = (e, data) => {
    const snappedLeftX = Math.round(data.x / 10) * 10;
  
    // Clamp within field minus endzones and node width
    const minX = ENDZONE_WIDTH;
    const maxX = 1100 - ENDZONE_WIDTH;
  
    let move = snappedLeftX;
    if (move < minX) move = minX;
    if (move > maxX) move = maxX;
  
    dispatch(nodeFunc({
      id,
      x: move,
      y: node.y
    }))
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{x: node.x, y: node.y}}
      axis="x"
      onDrag={handleDrag}
      grid={[YARD_WIDTH, YARD_WIDTH]} 
    >
      <div ref={nodeRef} className="playerNode" style={{backgroundColor: color}}>
      <div
        style={{
          position: 'absolute',
          left: '12px',
          top: -7,
          bottom: 25,
          width: '3px',
          backgroundColor: 'cyan',
          // transform: 'translateX(100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '12px',
          top: 25,
          bottom: -7,
          width: '3px',
          backgroundColor: 'cyan',
          // transform: 'translateX(100%)',
          pointerEvents: 'none',
        }}
      />
        {id}
      </div>
    </Draggable>
  );
};

export default PlayerNode;
