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
  battle_turns: BattleTurn[];
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
  const redSidePokemon: PokemonBattleState[] = redSidePokemonBuilds.map((pokemonBuild: PokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "blue") });

  return {
    config: config,
    turn_index: 0,
    status: "active",
    winner: null,
    battle_turns: [],
    battle_state: createNewBattleState(config, blueSidePokemon, redSidePokemon)
  }

}
