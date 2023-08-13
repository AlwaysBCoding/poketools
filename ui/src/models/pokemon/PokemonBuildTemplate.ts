import {
  PokemonAbilityIdent,
  PokemonGender,
  PokemonItemIdent,
  PokemonMoveIdent,
  PokemonNatureIdent,
  PokemonStatSpread,
  PokemonTypeIdent,
} from "./PokemonShared";

export interface PokemonBuildTemplate {
  pokemon_ident: string;
  nickname: string | null;
  item_ident: PokemonItemIdent | null;
  ability_ident: PokemonAbilityIdent;
  level: number;
  shiny: boolean;
  gender: PokemonGender | null;
  tera_type_ident: PokemonTypeIdent | null;
  nature_ident: PokemonNatureIdent;
  move_idents: PokemonMoveIdent[];
  iv_spread: PokemonStatSpread;
  ev_spread: PokemonStatSpread;
}
