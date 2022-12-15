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

export const createEmptyBattleState = (): BattleState => {

  return {
    config: {
      variant: "doubles"
    },
    turn_index: 0,
    global_state: {
      terrain: "none",
      weather: "none",
      auras: []
    },
    blue_side_state: {
      reflect: false,
      light_screen: false,
      aurora_veil: false,
      tailwind: false,
      hazards: []
    },
    red_side_state: {
      reflect: false,
      light_screen: false,
      aurora_veil: false,
      tailwind: false,
      hazards: []
    },
    blue_side_pokemon: [],
    red_side_pokemon: []
  };

}
