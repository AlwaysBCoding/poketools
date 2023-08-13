import { BattleSide } from "../../models/battle/BattleShared";
import { BattleState } from "../../models/battle/BattleState";
import {
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../../models/pokemon/PokemonBuild";
import { PokemonBattleState, createNewPokemonBattleState } from "../../models/battle/PokemonBattleState";

export const createNewBattleState = (blueSidePokemon: PokemonBattleState[], redSidePokemon: PokemonBattleState[]): BattleState => {

  const newBattleState: BattleState = {
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
    field_state: {},
    blue_side_pokemon: blueSidePokemon,
    red_side_pokemon: redSidePokemon
  };

  return newBattleState;

};

export const createNewBattleState1v1 = (blueSidePokemonBuild: PokemonBuild, redSidePokemonBuild: PokemonBuild): BattleState => {

  const newBattleState: BattleState = {
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
    field_state: {},
    blue_side_pokemon: [createNewPokemonBattleState(blueSidePokemonBuild, "blue")],
    red_side_pokemon: [createNewPokemonBattleState(redSidePokemonBuild, "red")]
  };

  return newBattleState;

}
