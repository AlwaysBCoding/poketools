import {
  PokemonAbility,
  PokemonEvolutionLine,
  PokemonGender,
  PokemonMove,
  PokemonStatSpread,
  PokemonType
} from "./PokemonShared";

export interface Pokemon {
  ident: string;
  national_pokedex_number: number;
  paldea_regional_pokedex_number: number;
  evolution_line_ident: PokemonEvolutionLine;
  evolution_line_index: number;
  primary_type_ident: PokemonType;
  secondary_type_ident: PokemonType | null;
  weight: number;
  genders: PokemonGender[];
  base_stats: PokemonStatSpread;
  ability_idents: PokemonAbility[];
  move_idents: PokemonMove[];
}
