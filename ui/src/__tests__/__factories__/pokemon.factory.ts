import { PokemonBuildTemplate } from "../../models/pokemon/PokemonBuildTemplate";

export const BAXCALIBUR_DEFAULT_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "baxcalibur",
  nickname: null,
  ability_ident: "thermal-exchange",
  item_ident: "clear-amulet",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "dragon",
  nature_ident: "adamant",
  move_idents: ["protect", "glaive-rush", "ice-shard", "icicle-spear"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 228,
    attack: 196,
    defense: 4,
    special_attack: 0,
    special_defense: 60,
    speed: 20
  }
}

export const DRAGONITE_SIMPLE_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "dragonite",
  nickname: null,
  ability_ident: "multiscale",
  item_ident: "choice-band",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "normal",
  nature_ident: "adamant",
  move_idents: ["dual-wingbeat", "dragon-claw", "extreme-speed", "giga-impact"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 244,
    attack: 4,
    defense: 36,
    special_attack: 0,
    special_defense: 4,
    speed: 220
  }
}

export const DRAGAPULT_SIMPLE_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "dragapult",
  nickname: null,
  ability_ident: "clear-body",
  item_ident: "focus-sash",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "dragon",
  nature_ident: "timid",
  move_idents: ["draco-meteor", "hex", "quick-attack", "dragon-tail"],
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
    attack: 0,
    defense: 4,
    special_attack: 252,
    special_defense: 0,
    speed: 252
  }
}

export const AMPHAROS_SIMPLE_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "ampharos",
  nickname: null,
  ability_ident: "static",
  item_ident: "focus-sash",
  level: 50,
  shiny: false,
  gender: "female",
  tera_type_ident: "electric",
  nature_ident: "modest",
  move_idents: ["volt-switch", "dragon-pulse", "focus-blast", "thunderbolt"],
  iv_spread: {
    hp: 31,
    attack: 0,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 4,
    attack: 0,
    defense: 0,
    special_attack: 252,
    special_defense: 0,
    speed: 252
  }
}

export const GASTRODON_ATEAM_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "gastrodon",
  nickname: null,
  item_ident: "leftovers",
  ability_ident: "storm-drain",
  level: 50,
  shiny: false,
  gender: "female",
  tera_type_ident: "grass",
  nature_ident: "calm",
  move_idents: ["clear-smog", "hydro-pump", "earth-power", "protect"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 0
  },
  ev_spread: {
    hp: 252,
    attack: 0,
    defense: 0,
    special_attack: 124,
    special_defense: 132,
    speed: 0
  }
}

export const GRIMMSNARL_ATEAM_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "grimmsnarl",
  nickname: null,
  item_ident: "iron-ball",
  ability_ident: "prankster",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "steel",
  nature_ident: "adamant",
  move_idents: ["reflect", "light-screen", "trick", "spirit-break"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 200,
    attack: 130,
    defense: 0,
    special_attack: 0,
    special_defense: 126,
    speed: 0
  }
}

export const GARCHOMP_ATEAM_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "garchomp",
  nickname: null,
  item_ident: "life-orb",
  ability_ident: "rough-skin",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "fire",
  nature_ident: "adamant",
  move_idents: ["dragon-claw", "earthquake", "tera-blast", "protect"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 4,
    attack: 252,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 252
  }
}

export const GHOLDENGO_ATEAM_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "gholdengo",
  nickname: null,
  item_ident: "focus-sash",
  ability_ident: "good-as-gold",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "flying",
  nature_ident: "timid",
  move_idents: ["shadow-ball", "thunderbolt", "make-it-rain", "protect"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 4,
    attack: 0,
    defense: 0,
    special_attack: 252,
    special_defense: 0,
    speed: 252
  }
}

export const TALONFLAME_ATEAM_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "talonflame",
  nickname: null,
  item_ident: "sharp-beak",
  ability_ident: "gale-wings",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "flying",
  nature_ident: "adamant",
  move_idents: ["tailwind", "brave-bird", "flare-blitz", "feint"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 4,
    attack: 252,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 252
  }
}

export const ANNIHILAPE_BULKY_BUILD: PokemonBuildTemplate = {
  pokemon_ident: "annihilape",
  nickname: null,
  item_ident: "leftovers",
  ability_ident: "defiant",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "fire",
  nature_ident: "impish",
  move_idents: ["bulk-up", "drain-punch", "rage-fist", "protect"],
  iv_spread: {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  },
  ev_spread: {
    hp: 252,
    attack: 4,
    defense: 126,
    special_attack: 0,
    special_defense: 126,
    speed: 0
  }
}

export const MEOWSCARADA_MAX_STATS: PokemonBuildTemplate = {
  pokemon_ident: "meowscarada",
  nickname: null,
  item_ident: "heavy-duty-boots",
  ability_ident: "overgrow",
  level: 50,
  shiny: false,
  gender: "male",
  tera_type_ident: "grass",
  nature_ident: "jolly",
  move_idents: ["u-turn", "knock-off", "energy-ball", "flower-trick"],
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

export const QUAXWELL_MAX_STATS: PokemonBuildTemplate = {
  pokemon_ident: "quaxwell",
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

export const QUAQUAVAL_MAX_STATS: PokemonBuildTemplate = {
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
