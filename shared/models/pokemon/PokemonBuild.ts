import {
  PokemonAbilityIdent,
  PokemonGender,
  PokemonItemIdent,
  PokemonMoveIdent,
  PokemonNatureIdent,
  PokemonStatSpread,
  PokemonTypeIdent
} from './PokemonShared';

import { Pokemon } from './Pokemon';
// import { PokemonBuildTemplate } from './PokemonBuildTemplate';

export interface PokemonBuild {
  nickname: string | null;
  pokemon: Pokemon;
  ability_ident: PokemonAbilityIdent;
  item_ident: PokemonItemIdent | null;
  level: number;
  shiny: boolean;
  gender: PokemonGender;
  tera_type_ident: PokemonTypeIdent;
  nature_ident: PokemonNatureIdent;
  move_idents: PokemonMoveIdent[];
  iv_spread: PokemonStatSpread;
  ev_spread: PokemonStatSpread;
  stat_spread: PokemonStatSpread;
}
