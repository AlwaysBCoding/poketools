import {
  PokemonAbilityIdent,
  PokemonEvolutionLine,
  PokemonGender,
  PokemonMoveIdent,
  PokemonStatSpread,
  PokemonTypeIdent
} from "./PokemonShared";

export interface Pokemon {
  ident: string;
  forme_root_ident?: string;
  national_pokedex_number: number;
  regional_pokedex_number: number;
  pokedex_region: "kanto" | "alola" | "galar" | "hisui" | "paldea";
  evolution_line_ident: PokemonEvolutionLine;
  evolution_line_index: number;
  can_evolve?: boolean;
  primary_type_ident: PokemonTypeIdent;
  secondary_type_ident: PokemonTypeIdent | null;
  weight: number;
  genders: PokemonGender[];
  base_stats: PokemonStatSpread;
  ability_idents: PokemonAbilityIdent[];
  move_idents: PokemonMoveIdent[];
}
