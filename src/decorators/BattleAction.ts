import { BattleAction } from "../models/battle/BattleAction";
import { displayPokemonIdent } from "./Pokemon";
import { displayPokemonMove } from "./PokemonMove";

export const displayBattleAction = (battleAction: BattleAction): string => {
  if(battleAction.action_type === "move") {
    return displayPokemonMove(battleAction.action_data.move.ident);
  }
  if(battleAction.action_type === "switch") {
    return `switch -> ${displayPokemonIdent(battleAction.action_data.switch_target_pokemon_ident)}`;
  }
  return "";
}
