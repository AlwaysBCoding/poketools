import { PokemonBuild } from "../../models/PokemonBuild";

export const MEOWSCARADA_MAX_STATS: PokemonBuild = {
  pokemon_ident: "meowscarada",
  nickname: null,
  item_ident: "heavy-duty-boots",
  ability_ident: "overgrow",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "grass",
  nature_ident: "jolly",
  move_idents: ["u-turn", "knock-off", "sucker-punch", "flower-trick"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 0,
    attack: 252,
    defense: 0,
    special_attack: 0,
    special_defense: 4,
    speed: 252
  }
};

export const QUAQUAVAL_MAX_STATS = {
  pokemon_ident: "quaquaval",
  nickname: null,
  item_ident: "lum-berry",
  ability_ident: "moxie",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "electric",
  nature_ident: "jolly",
  move_idents: ["swords-dance", "aqua-step", "close-combat", "tera-blast"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 0,
    attack: 252,
    defense: 0,
    special_attack: 0,
    special_defense: 4,
    speed: 252
  }
};
