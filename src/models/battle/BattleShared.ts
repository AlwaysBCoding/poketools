export type BattleVariant = "singles" | "doubles";

export interface BattleConfig {
  variant: BattleVariant;
}

export type BattleStatus = "preview" | "active" | "complete";

export interface BattleGlobalState {
  terrain: TerrainState | null;
  terrain_counter: number;
  weather: WeatherState | null;
  weather_counter: number;
  auras: AuraState[];
}

export type BattleSide = "red" | "blue";

export type HazardIdent =
  | "stealth-rocks"
  | "spikes"
  | "toxic-spikes";

export interface BattleSideState {
  reflect: number;
  light_screen: number;
  aurora_veil: number;
  tailwind: number;
  hazards: HazardIdent[];
}

export type PokemonBattleLocation = "field" | "party" | "preview" | "graveyard";

export interface PokemonStatBoosts {
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  accuracy: number;
  evasiveness: number;
  critical_hit: number;
}

export type TerrainState =
  | "none"
  | "electric"
  | "grassy"
  | "misty"
  | "psychic";

export type WeatherState =
  | "none"
  | "rain"
  | "sandstorm"
  | "snow"
  | "sun";

export type AuraState =
  | "aura-break"
  | "fairy-aura"
  | "dark-aura";

export type PokemonStatusIdent =
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
  | "drowsy"
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

export type BattleSlot =
  | "blue-field-1"
  | "blue-field-2"
  | "blue-party-1"
  | "blue-party-2"
  | "blue-party-3"
  | "blue-party-4"
  | "blue-party-5"
  | "blue-party-6"
  | "blue-graveyard-1"
  | "blue-graveyard-2"
  | "blue-graveyard-3"
  | "blue-graveyard-4"
  | "blue-graveyard-5"
  | "blue-graveyard-6"
  | "red-field-1"
  | "red-field-2"
  | "red-party-1"
  | "red-party-2"
  | "red-party-3"
  | "red-party-4"
  | "red-party-5"
  | "red-party-6"
  | "red-graveyard-1"
  | "red-graveyard-2"
  | "red-graveyard-3"
  | "red-graveyard-4"
  | "red-graveyard-5"
  | "red-graveyard-6"
