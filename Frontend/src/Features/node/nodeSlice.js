import { createSlice } from "@reduxjs/toolkit";

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    offenseNode: {
      Start: { x: 0, y: 130 },
      End: { x: 0, y: 130 }
    },
    defenseNode: {
      Start: { x: 0, y: 170 },
      End: { x: 0, y: 170 }
    },
    penaltyNode: {
      Start: { x: 0, y: 210 },
      End: { x: 0, y: 210 }
    }
  },
  reducers: {
    setDefault: (state, action) => {
      const { ballOnYard, yardWidth, endzoneWidth } = action.payload

      const offenseEndX = (30 * yardWidth) + endzoneWidth;
      const offenseStartX = (ballOnYard * yardWidth) + endzoneWidth;

      state.offenseNode = {
        Start: { x: offenseStartX, y: 130 },
        End: { x: offenseEndX, y: 130 }
      };

      state.defenseNode = {
        Start: { x: offenseEndX, y: 170 },
        End: { x: offenseStartX, y: 170 }
      };

      state.penaltyNode = {
        Start: { x: offenseEndX, y: 210 },
        End: { x: offenseStartX, y: 210 }
      };
    },
    setOffenseNode: (state, action) => {
      const { id, x, y } = action.payload;
      const node = state.offenseNode[id]

      if (node && node.x === x && node.y === y) {
        return
      }

      state.offenseNode[id] = { x, y };
    },
    setDefenseNode: (state, action) => {
      const { id, x, y } = action.payload;
      const node = state.defenseNode[id]

      if (node && node.x === x && node.y === y) {
        return
      }

      state.defenseNode[id] = { x, y };
    },
    setPenaltyNode: (state, action) => {
      const { id, x, y } = action.payload;
      const node = state.penaltyNode[id]

      if (node && node.x === x && node.y === y) {
        return
      }

      state.penaltyNode[id] = { x, y };
    },
  }
})

export const { setDefault, setOffenseNode, setDefenseNode, setPenaltyNode } = nodeSlice.actions
export default nodeSlice.reducer