import { PokemonBuild } from "../PokemonBuild";
import {
  BattleSide,
  PokemonStatBoosts,
  PokemonStatus,
  PokemonVolatileStatus
} from "./BattleShared";

export interface PokemonBattleState {
  pokemon_build: PokemonBuild;
  side: BattleSide;
  status: PokemonStatus;
  volatile_statuses: PokemonVolatileStatus[];
  stat_boots: PokemonStatBoosts;
  terastallized: boolean;
  current_hp: number;
}
