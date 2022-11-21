export interface BattleGlobalState {
  terrain: TerrainState;
  weather: WeatherState;
  auras: AuraState[];
}

export type BattleSide =
  | "red"
  | "blue"

export interface BattleSideState {
  reflect: boolean;
  light_screen: boolean;
  aurora_veil: boolean;
  tailwind: boolean;
}

export interface PokemonStatBoosts {
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

export type TerrainState =
  | "none"
  | "electric"
  | "grassy"
  | "misty"
  | "psychic";

export type WeatherState =
  | "none"
  | "sun"
  | "rain"
  | "sand"
  | "snow";

export type AuraState =
  | "aura-break"
  | "fairy-aura"
  | "dark-aura";

export type PokemonStatus =
  | "none"
  | "poisoned"
  | "badly-poisoned"
  | "burned"
  | "paralyzed"
  | "asleep"
  | "frozen"

export type PokemonVolatileStatus =
  | "flinched"
  | "confused"
  | "taunted"
  | "substitute"
