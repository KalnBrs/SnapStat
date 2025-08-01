import './PlayerNode.css';
import Draggable from 'react-draggable';
import { useState, useRef } from 'react';

const NODE_WIDTH = 30;
const ENDZONE_WIDTH = 50;
const YARD_WIDTH = 10;

const PlayerNode = ({ node, id, setNodes, color }) => {
  const [pos, setPos] = useState({ x: node["x"], y: node["y"] });
  const nodeRef = useRef(null); 

  const handleDrag = (e, data) => {
    const snappedLeftX = Math.round(data.x / 10) * 10;
  
    // Clamp within field minus endzones and node width
    const minX = ENDZONE_WIDTH;
    const maxX = 1100 - ENDZONE_WIDTH;
  
    let move = snappedLeftX;
    if (move < minX) move = minX;
    if (move > maxX) move = maxX;
  
    setPos({ x: move, y: node.y });
    setNodes(prev => ({
      ...prev,
      [id]: { x: move, y: node.y },
    }));
  };  

  return (
    <Draggable
      nodeRef={nodeRef}
      position={pos}
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
