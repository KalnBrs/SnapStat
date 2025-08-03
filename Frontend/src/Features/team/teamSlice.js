import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    home: {
      "team_id": "1",
      "team_name": "Monona Grove",
      "abbreviation": "MG",
      "color": "#78ADD5",
      "logo_url": "https://sportshub2-uploads.vnn-prod.zone/files/sites/3605/2023/02/17230909/MGSD_MGHS_Mascot-Icon_Full-Color_SPOT-1-1.png"
    }, 
    away: {
      "team_id": "2",
      "team_name": "Sun Praire East",
      "abbreviation": "SPE",
      "color": "#D12026",
      "logo_url": null
    }
  },
  reducers: {
    setHome: (state, action) => {
      state.home = action.payload
    },
    setAway: (state, action) => {
      state.away = action.payload
    }
  }
})

export const { setHome, setAway } = teamSlice.actions
export default teamSlice.reducer