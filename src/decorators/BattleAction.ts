import { BattleAction } from "../models/battle/BattleAction";

export const displayBattleAction = (battleAction: BattleAction): string => {
  if(battleAction.action_type === "move") {
    return `${battleAction.action_data.move.ident}`;
  }
  if(battleAction.action_type === "switch") {
    return `switch -> ${battleAction.action_data.switch_target.pokemon_build.pokemon.ident}`;
  }
  return "";
}
