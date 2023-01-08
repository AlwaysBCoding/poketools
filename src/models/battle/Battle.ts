import { PokemonBuild } from "../pokemon/PokemonBuild";
import { BattleConfig, BattleStatus, BattleSide } from "./BattleShared";
import { BattleState, createNewBattleState } from "./BattleState";
import { PokemonBattleState, createNewPokemonBattleState } from "./PokemonBattleState";
import { Pokemon } from "../pokemon/Pokemon";

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
  blueSidePartyPokemonIndexes?: number[];
  redSidePartyPokemonIndexes?: number[];
  blueSideFieldPokemonIndexes?: number[];
  redSideFieldPokemonIndexes?: number[];
}

export const createBattle = ({
  config,
  blueSidePokemonBuilds,
  redSidePokemonBuilds,
  blueSidePartyPokemonIndexes,
  redSidePartyPokemonIndexes,
  blueSideFieldPokemonIndexes,
  redSideFieldPokemonIndexes,

}: CreateBattleParams): Battle => {

  const blueSideOrderedPokemon: PokemonBattleState[] = [];
  const redSideOrderedPokemon: PokemonBattleState[] = [];

  const blueSidePokemon: PokemonBattleState[] = blueSidePokemonBuilds.map((pokemonBuild: PokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "blue") });
  const redSidePokemon: PokemonBattleState[] = redSidePokemonBuilds.map((pokemonBuild: PokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "red") });

  if(blueSideFieldPokemonIndexes && redSideFieldPokemonIndexes) {
    blueSideOrderedPokemon.push(blueSidePokemon[blueSideFieldPokemonIndexes[0]]);
    blueSideOrderedPokemon.push(blueSidePokemon[blueSideFieldPokemonIndexes[1]]);
    redSideOrderedPokemon.push(redSidePokemon[redSideFieldPokemonIndexes[0]]);
    redSideOrderedPokemon.push(redSidePokemon[redSideFieldPokemonIndexes[1]]);

    if(blueSidePartyPokemonIndexes && redSidePartyPokemonIndexes) {
      blueSideOrderedPokemon.push(blueSidePokemon[blueSidePartyPokemonIndexes[0]]);
      blueSideOrderedPokemon.push(blueSidePokemon[blueSidePartyPokemonIndexes[1]]);
      redSideOrderedPokemon.push(redSidePokemon[redSidePartyPokemonIndexes[0]]);
      redSideOrderedPokemon.push(redSidePokemon[redSidePartyPokemonIndexes[1]]);
    }
  }

  const blueSidePokemonIndexes = [...Array(blueSidePokemon.length).keys()];
  const redSidePokemonIndexes = [...Array(redSidePokemon.length).keys()];

  const remainingBlueSidePokemonIndexes = blueSidePokemonIndexes.filter((value: number) => {
    return !blueSidePartyPokemonIndexes?.includes(value) && !blueSideFieldPokemonIndexes?.includes(value);
  });
  const remainingRedSidePokemonIndexes = redSidePokemonIndexes.filter((value: number) => {
    return !redSidePartyPokemonIndexes?.includes(value) && !redSideFieldPokemonIndexes?.includes(value);
  });
  for (const blueSidePokemonIndex of remainingBlueSidePokemonIndexes) {
    blueSideOrderedPokemon.push(blueSidePokemon[blueSidePokemonIndex]);
  }
  for (const redSidePokemonIndex of remainingRedSidePokemonIndexes) {
    redSideOrderedPokemon.push(redSidePokemon[redSidePokemonIndex]);
  }

  return {
    config: config,
    turn_index: 0,
    status: "active",
    winner: null,
    battle_turns: [],
    battle_state: createNewBattleState(config, blueSideOrderedPokemon, redSideOrderedPokemon)
  }

}

export const initialStep = (battle: Battle): Battle => {
  if(battle.config.variant === "doubles") {

    battle.battle_state.blue_side_pokemon[0].location = "field";
    battle.battle_state.blue_side_pokemon[1].location = "field";
    battle.battle_state.blue_side_pokemon[2].location = "party";
    battle.battle_state.blue_side_pokemon[3].location = "party";
    battle.battle_state.red_side_pokemon[0].location = "field";
    battle.battle_state.red_side_pokemon[1].location = "field";
    battle.battle_state.red_side_pokemon[2].location = "party";
    battle.battle_state.red_side_pokemon[3].location = "party";
    battle.battle_state.field_state["blue-field-1"] = battle.battle_state.blue_side_pokemon[0].battle_id;
    battle.battle_state.field_state["blue-field-2"] = battle.battle_state.blue_side_pokemon[1].battle_id;
    battle.battle_state.field_state["red-field-1"] = battle.battle_state.red_side_pokemon[0].battle_id;
    battle.battle_state.field_state["red-field-2"] = battle.battle_state.red_side_pokemon[1].battle_id;

    battle.battle_turns.push([
      "Battle Started!",
      `Go ${battle.battle_state.blue_side_pokemon[0].pokemon_build.pokemon.ident}!`,
      `Go ${battle.battle_state.blue_side_pokemon[1].pokemon_build.pokemon.ident}!`,
      `Go ${battle.battle_state.red_side_pokemon[0].pokemon_build.pokemon.ident}!`,
      `Go ${battle.battle_state.red_side_pokemon[1].pokemon_build.pokemon.ident}!`
    ]);

  } else if(battle.config.variant === "singles") {

    battle.battle_state.blue_side_pokemon[0].location = "field";
    battle.battle_state.red_side_pokemon[0].location = "field";
    battle.battle_state.field_state["blue-field-1"] = battle.battle_state.blue_side_pokemon[0].battle_id;
    battle.battle_state.field_state["red-field-1"] = battle.battle_state.red_side_pokemon[0].battle_id;

    battle.battle_turns.push([
      "Battle Started!",
      `Go ${battle.battle_state.blue_side_pokemon[0].pokemon_build.pokemon.ident}!`,
      `Go ${battle.battle_state.red_side_pokemon[0].pokemon_build.pokemon.ident}!`
    ]);
  }

  battle.turn_index += 1;
  return battle;
}
