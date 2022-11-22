import { BattleSide } from "../../models/battle/BattleShared";
import { BattleState } from "../../models/battle/BattleState";
import {
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../../models/pokemon/PokemonBuild";
import { PokemonBattleState } from "../../models/battle/PokemonBattleState";

const createNewPokemonBattleState = (pokemonBuild: PokemonBuild, side: BattleSide): PokemonBattleState => {

  return {
    pokemon_build: pokemonBuild,
    side: side,
    status: "none",
    volatile_statuses: [],
    stat_boosts: {
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0
    },
    terastallized: false,
    current_hp: pokemonBuild.stat_spread.hp
  }

}

export const createNewBattle = (): BattleState => {

  const meowscaradaBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
  const quaquavalBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);

  const newBattleState: BattleState = {
    global_state: {
      terrain: "none",
      weather: "none",
      auras: []
    },
    blue_side_state: {
      reflect: false,
      light_screen: false,
      aurora_veil: false,
      tailwind: false
    },
    red_side_state: {
      reflect: false,
      light_screen: false,
      aurora_veil: false,
      tailwind: false
    },
    blue_side_pokemon: [createNewPokemonBattleState(meowscaradaBuild, "blue")],
    red_side_pokemon: [createNewPokemonBattleState(quaquavalBuild, "red")]
  };

  return newBattleState;

};
