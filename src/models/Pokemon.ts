import {
  PokemonAbility,
  PokemonEvolutionLine,
  PokemonGender,
  PokemonMove,
  PokemonType
} from "./PokemonShared";

export interface PokemonBaseStats {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

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
  base_stats: PokemonBaseStats;
  ability_idents: PokemonAbility[];
  move_idents: PokemonMove[];
}
