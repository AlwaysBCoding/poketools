import { calculateDamage } from "../models/battle/damage-calc";

const battleState1 = {
  global_state: {
    terrain: "none",
    weather: "none",
    auras: []
  },
  blue_side_state: {
    reflect: false,
    light_screen: false,
    aurora_veil: false,
    tailwind: false
  },
  red_side_state: {
    reflect: false,
    light_screen: false,
    aurora_veil: false,
    tailwind: false
  }
};

const attackingPokemonBattleState = {
  pokemon_build: {
    pokemon_ident: "sprigatito",
    nickname: null,
    item_ident: "leftovers",
    ability_ident: "overgrow",
    level: 50,
    shiny: false,
    gender: "male",
    tera_type_ident: "grass",
    nature_ident: "naughty",
    move_idents: ["energy-ball", "acrobatics", "giga-drain", "quick-attack"],
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
      attack: 252,
      defense: 0,
      special_attack: 4,
      special_defense: 0,
      speed: 0
    }
  },
  status: "none",
  volatile_statuses: [],
  stat_boosts: {
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0
  },
  terastallized: false,
  current_hp: 147
};

const targetPokemonBattleState = {
  pokemon_build: {
    pokemon_ident: "quaxly",
    nickname: null,
    item_ident: "life-orb",
    ability_ident: "torrent",
    level: 50,
    shiny: false,
    gender: "male",
    tera_type_ident: "water",
    nature_ident: "gentle",
    move_idents: ["acrobatics", "aqua-jet", "surf", "protect"],
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
      defense: 0,
      special_attack: 0,
      special_defense: 252,
      speed: 0
    }
  },
  status: "none",
  volatile_statuses: [],
  stat_boosts: {
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0
  },
  terastallized: false,
  current_hp: 162
};

describe("DAMAGE_CALC", () => {

  test("it runs the test", () => {
    const result = calculateDamage(
      battleState1,
      attackingPokemonBattleState,
      targetPokemonBattleState,
      "energy-ball"
    );
    expect(result).toEqual(
      [66, 66, 66, 66, 68, 68, 68, 68, 72, 72, 72, 72, 74, 74, 74, 78]
    );
  });

});
