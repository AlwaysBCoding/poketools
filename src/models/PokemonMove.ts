interface PokemonMoveCategory {
  ident: string;
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
}
