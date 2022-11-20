interface EffectivenessValue {
  ident: string;
  value: number;
}

export const EffectivenessValues: EffectivenessValue[] = [
  {ident: "no-effect", value: 0},
  {ident: "not-very-effective", value: 0.5},
  {ident: "effective", value: 1},
  {ident: "super-effective", value: 2}
];

export interface PokemonTypeEffectiveness {
  offensive_type_ident: string;
  defensive_type_ident: string;
  effectiveness: number;
}

export const PokemonTypeEffectivenessValues: PokemonTypeEffectiveness[] = [
  {offensive_type_ident: "normal", defensive_type_ident: "normal", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "fighting", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "flying", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "poison", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "ground", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "rock", effectiveness: 0.5},
  {offensive_type_ident: "normal", defensive_type_ident: "bug", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "ghost", effectiveness: 0},
  {offensive_type_ident: "normal", defensive_type_ident: "steel", effectiveness: 0.5},
  {offensive_type_ident: "normal", defensive_type_ident: "fire", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "water", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "grass", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "electric", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "psychic", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "ice", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "dragon", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "dark", effectiveness: 1},
  {offensive_type_ident: "normal", defensive_type_ident: "fairy", effectiveness: 1},

  {offensive_type_ident: "fighting", defensive_type_ident: "normal", effectiveness: 2},
  {offensive_type_ident: "fighting", defensive_type_ident: "fighting", effectiveness: 1},
  {offensive_type_ident: "fighting", defensive_type_ident: "flying", effectiveness: 0.5},
  {offensive_type_ident: "fighting", defensive_type_ident: "poison", effectiveness: 0.5},
  {offensive_type_ident: "fighting", defensive_type_ident: "ground", effectiveness: 1},
  {offensive_type_ident: "fighting", defensive_type_ident: "rock", effectiveness: 2},
  {offensive_type_ident: "fighting", defensive_type_ident: "bug", effectiveness: 0.5},
  {offensive_type_ident: "fighting", defensive_type_ident: "ghost", effectiveness: 0},
  {offensive_type_ident: "fighting", defensive_type_ident: "steel", effectiveness: 2},
  {offensive_type_ident: "fighting", defensive_type_ident: "fire", effectiveness: 1},
  {offensive_type_ident: "fighting", defensive_type_ident: "water", effectiveness: 1},
  {offensive_type_ident: "fighting", defensive_type_ident: "grass", effectiveness: 1},
  {offensive_type_ident: "fighting", defensive_type_ident: "electric", effectiveness: 1},
  {offensive_type_ident: "fighting", defensive_type_ident: "psychic", effectiveness: 0.5},
  {offensive_type_ident: "fighting", defensive_type_ident: "ice", effectiveness: 2},
  {offensive_type_ident: "fighting", defensive_type_ident: "dragon", effectiveness: 1},
  {offensive_type_ident: "fighting", defensive_type_ident: "dark", effectiveness: 2},
  {offensive_type_ident: "fighting", defensive_type_ident: "fairy", effectiveness: 0.5},

  {offensive_type_ident: "flying", defensive_type_ident: "normal", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "fighting", effectiveness: 2},
  {offensive_type_ident: "flying", defensive_type_ident: "flying", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "poison", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "ground", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "rock", effectiveness: 0.5},
  {offensive_type_ident: "flying", defensive_type_ident: "bug", effectiveness: 2},
  {offensive_type_ident: "flying", defensive_type_ident: "ghost", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "steel", effectiveness: 0.5},
  {offensive_type_ident: "flying", defensive_type_ident: "fire", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "water", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "grass", effectiveness: 2},
  {offensive_type_ident: "flying", defensive_type_ident: "electric", effectiveness: 0.5},
  {offensive_type_ident: "flying", defensive_type_ident: "psychic", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "ice", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "dragon", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "dark", effectiveness: 1},
  {offensive_type_ident: "flying", defensive_type_ident: "fairy", effectiveness: 1},
]
