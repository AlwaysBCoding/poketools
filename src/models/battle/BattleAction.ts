import {
  BattleSide
} from "./BattleShared";
import { PokemonBattleState } from "./PokemonBattleState";
import {
  PokemonMoveIdent,
  PokemonMoveTarget
} from "../pokemon/PokemonShared";

export interface BattleActionMove {
  actor_side: BattleSide;
  action_type: "move";
  actor_pokemon: PokemonBattleState;
  move_ident: PokemonMoveIdent;
  move_target: PokemonMoveTarget;
}

export interface BattleActionSwitch {
  actor_side: BattleSide;
  action_type: "switch";
  actor_pokemon: PokemonBattleState;
  switch_to_pokemon_index: number;
}

export type BattleAction =
  | BattleActionMove
  | BattleActionSwitch;
