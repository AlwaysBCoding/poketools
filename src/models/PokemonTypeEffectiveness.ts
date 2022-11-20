interface EffectivenessValue {
  ident: string;
  value: number;
}

export interface PokemonTypeEffectiveness {
  offensive_type_ident: string;
  defensive_type_ident: string;
  effectiveness: number;
}
