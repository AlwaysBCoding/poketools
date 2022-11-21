interface PokemonMoveCategory {
  ident: string;
}

interface PokemonStat {
  ident: string;
}

export interface PokemonMoveStatChange {
  stat_ident: string;
  stages: number;
  frequency: number;
}

interface PokemonStatus {
  ident: string;
}

export interface PokemonMoveStatusEffect {
  status_ident: string;
  frequency: number;
}

export interface PokemonMove {
  ident: string;
  description: string | null;
  detailed_description: string | null;
  type_ident: string;
  category_ident: string;
  base_power: number | null;
  accuracy: number | null;
  priority: number;
  pp: number;
  stat_changes: PokemonMoveStatChange[];
  status_effects: PokemonMoveStatusEffect[];
}
