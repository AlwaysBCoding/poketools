import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

export const Popup: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState('');

  useEffect(() => {
    const storedTeam = localStorage.getItem('activeTeam');
    if (storedTeam) {
      setActiveTeam(storedTeam);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveTeam(e.target.value);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('activeTeam', activeTeam);
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
          <input type="text" value={activeTeam} onChange={handleInputChange} />
          <button type="submit">Set Active Team</button>
        </form>
      )}
    </div>
  )
}
