import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Header } from "./components/Header";

import { HomeScreen } from "./screens/HomeScreen";
import { AllPokemonScreen } from './screens/AllPokemonScreen';
import { AllTeamsScreen } from "./screens/AllTeamsScreen";
import { TeamBuilderScreen } from "./screens/TeamBuilderScreen";
import { TeamMatchupScreen } from "./screens/TeamMatchupScreen";

export const App: React.FC<{}> = () => {
  return (
    <div className="Container">
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/all-pokemon" element={<AllPokemonScreen />} />
            <Route path="/all-teams" element={<AllTeamsScreen />} />
            <Route path="/team-builder" element={<TeamBuilderScreen />} />
            <Route path="/team-matchup" element={<TeamMatchupScreen />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
