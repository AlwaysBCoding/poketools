import { BattleConfig, BattleSideState, BattleGlobalState } from "./BattleShared";
import { PokemonBattleState } from "./PokemonBattleState";

export interface BattleState {
  config: BattleConfig;
  turn_index: number;
  global_state: BattleGlobalState;
  blue_side_state: BattleSideState;
  red_side_state: BattleSideState;
  blue_side_pokemon: PokemonBattleState[];
  red_side_pokemon: PokemonBattleState[];
};
