export type BattleVariant = "singles" | "doubles";

export interface BattleConfig {
  variant: BattleVariant;
}

export interface BattleGlobalState {
  terrain: TerrainState;
  weather: WeatherState;
  auras: AuraState[];
}

export type BattleSide =
  | "red"
  | "blue";

export type HazardIdent =
  | "stealth-rocks"
  | "spikes"
  | "toxic-spikes";

export interface BattleSideState {
  reflect: boolean;
  light_screen: boolean;
  aurora_veil: boolean;
  tailwind: boolean;
  hazards: HazardIdent[];
}

export type PokemonBattleLocation = "field" | "party" | "preview" | "graveyard";

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
  | "healthy"
  | "poisoned"
  | "badly-poisoned"
  | "burned"
  | "paralyzed"
  | "asleep"
  | "frozen";

export type PokemonVolatileStatus =
  | "flinched"
  | "confused"
  | "taunted"
  | "substitute";

export type BattleActionType =
  | "move"
  | "switch"

export type BattleEventType =
  | "hazard-create"
  | "hazard-destroy"
  | "move"
  | "move-secondary-effect"
  | "passive-damage"
  | "switch";
