import {
  PokemonAbilityIdent,
  PokemonEvolutionLine,
  PokemonGender,
  PokemonMoveIdent,
  PokemonStatSpread,
  PokemonTypeIdent
} from "./PokemonShared";

export interface Pokemon {
  ident: string;
  national_pokedex_number: number;
  paldea_regional_pokedex_number: number;
  evolution_line_ident: PokemonEvolutionLine;
  evolution_line_index: number;
  primary_type_ident: PokemonTypeIdent;
  secondary_type_ident: PokemonTypeIdent | null;
  weight: number;
  genders: PokemonGender[];
  base_stats: PokemonStatSpread;
  ability_idents: PokemonAbilityIdent[];
  move_idents: PokemonMoveIdent[];
}