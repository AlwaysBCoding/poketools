import {
  PokemonAbility,
  PokemonGender,
  PokemonItem,
  PokemonMove,
  PokemonNature,
  PokemonType
} from "./PokemonShared";

export interface PokemonBuild {
  pokemon_ident: string;
  nickname: string;
  item_ident: PokemonItem[];
  ability_ident: PokemonAbility[];
  level: number;
  gender: PokemonGender;
  tera_type_ident: PokemonType;
  nature_ident: PokemonNature;
  move_idents: PokemonMove[];
}
