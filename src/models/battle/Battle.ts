import { PokemonBuild } from "../pokemon/PokemonBuild";
import { BattleConfig, BattleStatus, BattleSide } from "./BattleShared";
import { BattleTurn } from "./BattleTurn";
import { BattleState, createNewBattleState } from "./BattleState";
import { PokemonBattleState, createNewPokemonBattleState } from "./PokemonBattleState";

export interface Battle {
  config: BattleConfig;
  turn_index: number;
  status: BattleStatus;
  winner: BattleSide | null;
  battle_turns: string[][];
  battle_state: BattleState;
}

interface CreateBattleParams {
  config: BattleConfig;
  blueSidePokemonBuilds: PokemonBuild[];
  redSidePokemonBuilds: PokemonBuild[];
}

export const createBattle = ({
  config,
  blueSidePokemonBuilds,
  redSidePokemonBuilds
}: CreateBattleParams): Battle => {

  const blueSidePokemon: PokemonBattleState[] = blueSidePokemonBuilds.map((pokemonBuild: PokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "blue") });
  const redSidePokemon: PokemonBattleState[] = redSidePokemonBuilds.map((pokemonBuild: PokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "red") });

  return {
    config: config,
    turn_index: 0,
    status: "active",
    winner: null,
    battle_turns: [],
    battle_state: createNewBattleState(config, blueSidePokemon, redSidePokemon)
  }

}

export const initialStep = (battle: Battle): Battle => {
  battle.battle_state.blue_side_pokemon[0].location = "field";
  battle.battle_state.red_side_pokemon[0].location = "field";
  battle.battle_state.field_state["blue-field-1"] = battle.battle_state.blue_side_pokemon[0].battle_id;
  battle.battle_state.field_state["red-field-1"] = battle.battle_state.red_side_pokemon[0].battle_id;

  battle.battle_turns.push([
    "Battle Started!",
    `Go ${battle.battle_state.blue_side_pokemon[0].pokemon_build.pokemon.ident}!`,
    `Go ${battle.battle_state.red_side_pokemon[0].pokemon_build.pokemon.ident}!`
  ]);
  battle.turn_index += 1;

  return battle;
}
