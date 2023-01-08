import { PokemonBattleState } from "./PokemonBattleState";
import { PokemonMoveIdent } from "../pokemon/PokemonShared";
import { PokemonMoveSimple } from "../pokemon/PokemonMove";

import AllMoves from "../../data/moves/all-moves.json";
const allMoves = AllMoves as PokemonMoveSimple[];

export interface BattleAction {
  actor: PokemonBattleState;
  action_type: "move" | "switch";
  action_data: Record<string, any>
}

export const composeMoveAction = (actor: PokemonBattleState, moveIdent: PokemonMoveIdent, moveTargets: string[]): BattleAction => {
  const move = allMoves.find((move: PokemonMoveSimple) => { return move.ident === moveIdent });

  return {
    actor: actor,
    action_type: "move",
    action_data: {
      "move": move,
      "move_targets": moveTargets,
      "selected_targets": moveTargets
    }
  }
}

export const composeSwitchAction = (actor: PokemonBattleState, switchTarget: PokemonBattleState): BattleAction => {
  return {
    actor: actor,
    action_type: "switch",
    action_data: {
      "switch_target": switchTarget
    }
  }
}
