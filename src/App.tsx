import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Header } from "./components/Header";

import { HomeScreen } from "./screens/HomeScreen";
import { AllPokemonScreen } from './screens/AllPokemonScreen';

export const App: React.FC<{}> = () => {
  return (
    <div className="Container">
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/all-pokemon" element={<AllPokemonScreen />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
