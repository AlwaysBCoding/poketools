interface PokemonEvolutionLine {
  ident: string;
}

interface PokemonBaseStats {
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
  evolution_line_ident: string;
  evolution_line_index: number;
  primary_type_ident: string;
  secondary_type_ident: string | null;
  weight: number;
  base_stats: PokemonBaseStats;
  ability_idents: string[];
  move_idents: string[];
}
