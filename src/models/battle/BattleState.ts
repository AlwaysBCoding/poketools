import { BattleSideState, BattleGlobalState, BattleConfig } from "./BattleShared";
import { PokemonBattleState } from "./PokemonBattleState";

export interface BattleState {
  global_state: BattleGlobalState;
  blue_side_state: BattleSideState;
  red_side_state: BattleSideState;
  field_state: any;
  blue_side_pokemon: PokemonBattleState[];
  red_side_pokemon: PokemonBattleState[];
};

export const createNewBattleState = (config: BattleConfig, blueSidePokemon: PokemonBattleState[], redSidePokemon: PokemonBattleState[]): BattleState => {
  let field_state = {};
  if(config.variant === "singles") {
    field_state = {
      "blue-field-1": null,
      "red-field-1": null
    }
  } else if(config.variant === "doubles") {
    field_state = {
      "blue-field-1": null,
      "blue-field-2": null,
      "red-field-1": null,
      "red-field-2": null
    }
  }

  return {
    global_state: {
      terrain: null,
      terrain_counter: 0,
      weather: null,
      weather_counter: 0,
      auras: []
    },
    blue_side_state: {
      reflect: 0,
      light_screen: 0,
      aurora_veil: 0,
      tailwind: 0,
      hazards: []
    },
    red_side_state: {
      reflect: 0,
      light_screen: 0,
      aurora_veil: 0,
      tailwind: 0,
      hazards: []
    },
    field_state: field_state,
    blue_side_pokemon: blueSidePokemon,
    red_side_pokemon: redSidePokemon
  }
}

export const createEmptyBattleState = (): BattleState => {

  return {
    global_state: {
      terrain: null,
      terrain_counter: 0,
      weather: null,
      weather_counter: 0,
      auras: []
    },
    blue_side_state: {
      reflect: 0,
      light_screen: 0,
      aurora_veil: 0,
      tailwind: 0,
      hazards: []
    },
    red_side_state: {
      reflect: 0,
      light_screen: 0,
      aurora_veil: 0,
      tailwind: 0,
      hazards: []
    },
    field_state: {
      "blue-field-1": null,
      "red-field-1": null
    },
    blue_side_pokemon: [],
    red_side_pokemon: []
  };

}
