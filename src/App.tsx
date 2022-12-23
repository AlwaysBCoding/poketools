import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Header } from "./components/Header";

import { HomeScreen } from "./screens/HomeScreen";
import { AllPokemonScreen } from './screens/AllPokemonScreen';
import { AllTeamsScreen } from "./screens/AllTeamsScreen";
import { PokemonBuilderScreen } from "./screens/PokemonBuilderScreen";
import { TeamBuilderScreen } from "./screens/TeamBuilderScreen";
import { TeamEditorScreen } from "./screens/TeamEditorScreen";
import { TeamMatchupScreen } from "./screens/TeamMatchupScreen";
import { DamageCalculationScreen } from "./screens/DamageCalculationScreen";
import { ImportTeamScreen } from "./screens/ImportTeamScreen";
import { BattleSimulatorScreen } from './screens/BattleSimulatorScreen';

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
            <Route path="/pokemon-builder" element={<PokemonBuilderScreen />} />
            <Route path="/team-builder" element={<TeamBuilderScreen />} />
            <Route path="/team-editor" element={<TeamEditorScreen />} />
            <Route path="/team-matchup" element={<TeamMatchupScreen />} />
            <Route path="/damage-calculation" element={<DamageCalculationScreen />} />
            <Route path="/import-team" element={<ImportTeamScreen />} />
            <Route path="/battle-simulator" element={<BattleSimulatorScreen />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
