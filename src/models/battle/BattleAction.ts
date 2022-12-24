import { PokemonBattleState } from "./PokemonBattleState";

export interface BattleAction {
  actor: PokemonBattleState;
  action_type: "move" | "switch";
  action_data: Record<string, any>
}
