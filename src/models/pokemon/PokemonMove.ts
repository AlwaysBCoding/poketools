import { PokemonTypeIdent, PokemonMoveCategory } from "./PokemonShared";

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

interface PokemonMoveModifierType {
  ident: string;
}

interface PokemonMoveModifierValue {
  ident: string;
}

interface PokemonMoveTarget {
  ident: string;
}

interface PokemonMoveDelegate {
  ident: string;
}

export interface PokemonMoveModifier {
  modifier_type_ident: string;
  modifier_target_ident: string;
  modifier_value_ident: string;
}

export interface PokemonMoveMultiHitFrequency {
  number_of_hits: number;
  frequency: number;
}

export interface PokemonMoveSimple {
  ident: string;
  type_ident: PokemonTypeIdent;
  category_ident: PokemonMoveCategory;
  base_power: number | null;
  accuracy: number | null;
  priority: number;
  pp: number;
  description: string;
  stat_changes?: any;
}

export interface PokemonMove {
  ident: string;
  description: string | null;
  detailed_description: string | null;
  type_ident: PokemonTypeIdent;
  category_ident: string;
  target_ident: string;
  base_power: number | null;
  accuracy: number | null;
  accuracy_check: boolean;
  priority: number;
  pp: number;
  stat_changes: PokemonMoveStatChange[] | null;
  status_effects: PokemonMoveStatusEffect[] | null;
  modifiers: PokemonMoveModifier[] | null;
  multi_hit_frequencies: PokemonMoveMultiHitFrequency[] | null;
  move_delegate_ident: PokemonMoveDelegate | null;
  move_delegate_exception_idents: string[] | null;
  fails_if_moves_last: boolean;
  successful_repeat_decay_value: number | null;
  successful_repeat_decay_move_idents: string[] | null;
}
