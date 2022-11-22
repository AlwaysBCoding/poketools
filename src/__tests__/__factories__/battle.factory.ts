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
    config: {
      variant: "singles"
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
    blue_side_pokemon: blueSidePokemon,
    red_side_pokemon: redSidePokemon
  };

  return newBattleState;

};

export const createNewBattleState1v1 = (blueSidePokemonBuild: PokemonBuild, redSidePokemonBuild: PokemonBuild): BattleState => {

  const newBattleState: BattleState = {
    config: {
      variant: "singles"
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
    blue_side_pokemon: [createNewPokemonBattleState(blueSidePokemonBuild, "blue")],
    red_side_pokemon: [createNewPokemonBattleState(redSidePokemonBuild, "red")]
  };

  return newBattleState;

}
