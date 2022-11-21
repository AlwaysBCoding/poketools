import {
  PokemonAbility,
  PokemonGender,
  PokemonItem,
  PokemonMove,
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
  move_idents: PokemonMove[];
}
