import React from "react";

import { Battle } from "../models/battle/Battle";

export const BattleRenderer: React.FC<{battle: Battle}> = ({ battle }) => {

  return (
    <div className="BattleRenderer">
      <h1>BATTLE RENDERER</h1>
    </div>
  )

}
