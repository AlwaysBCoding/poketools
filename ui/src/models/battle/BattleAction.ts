import { PokemonBattleState } from "./PokemonBattleState";
import { PokemonMoveIdent } from "../pokemon/PokemonShared";
import { PokemonMoveSimple } from "../pokemon/PokemonMove";
import { BattleSlot } from "./BattleShared";

import AllMoves from "../../data/moves/all-moves.json";
const allMoves = AllMoves as PokemonMoveSimple[];

export interface BattleAction {
  slot: BattleSlot;
  action_type: "move" | "switch" | "replace";
  action_data: Record<string, any>;
}

export const composeMoveAction = (slot: BattleSlot, moveIdent: PokemonMoveIdent, moveTargets: string[]): BattleAction => {
  const move = allMoves.find((move: PokemonMoveSimple) => { return move.ident === moveIdent });

  return {
    slot: slot,
    action_type: "move",
    action_data: {
      "move": move,
      "move_targets": moveTargets,
      "selected_targets": moveTargets
    }
  }
}

export const composeSwitchAction = (slot: BattleSlot, switchTargetBattleId: PokemonBattleState): BattleAction => {
  return {
    slot: slot,
    action_type: "switch",
    action_data: {
      "switch_target_battle_id": switchTargetBattleId
    }
  }
}

export const composeReplaceAction = (slot: BattleSlot, replaceTargetBattleId: string): BattleAction => {
  return {
    slot: slot,
    action_type: "replace",
    action_data: {
      "replace_target_battle_id": replaceTargetBattleId
    }
  }
}
