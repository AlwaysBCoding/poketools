import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PokemonTeam } from '../../shared/models/pokemon/PokemonTeam';
import { importTeam } from '../../shared/importTeam';

export const Popup: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState(undefined);
  const [importTeamText, setImportTeamText] = useState('');

  useEffect(() => {
    // const storedTeam = localStorage.getItem('activeTeam');
    // if (storedTeam) {
    //   setActiveTeam(storedTeam);
    // }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setImportTeamText(e.target.value);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const team: PokemonTeam | null = importTeam(importTeamText, uuidv4());
    if(team) {
      console.log(`GOT TEAM`);
      console.log(team);
    } else {
      console.log(`Error parsing team`);
    }
    // localStorage.setItem('activeTeam', activeTeam);
  }

  return (
    <div className="popup-container">
      {activeTeam ? (
        <div>
          <h1>Active Team</h1>
          <p>{activeTeam}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Paste the Active Team</h1>
          <textarea value={activeTeam} onChange={handleInputChange} />
          <button type="submit">Set Active Team</button>
        </form>
      )}
    </div>
  )
}
