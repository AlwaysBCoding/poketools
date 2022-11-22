import {
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";

import { BattleState } from "../models/battle/BattleState";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";

describe("ITEMS", () => {
  var meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
  var quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);

  describe("LIFE_ORB", () => {

    test("it multiplies the damage correctly", () => {
      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "leftovers"}),
        Object.assign(quaquavalBuild, {item_ident: "leftovers"})
      );
      var damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "u-turn"
      );
      expect([21, 22, 23, 24, 25]).toContain(damage);

      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "life-orb"}),
        Object.assign(quaquavalBuild, {item_ident: "leftovers"})
      );
      var damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "u-turn"
      );
      expect([27, 29, 30, 31, 32]).toContain(damage);
    });

  })

  describe("ASSAULT_VEST", () => {

    test("it reduces the damage correctly", () => {
      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "leftovers"}),
        Object.assign(quaquavalBuild, {item_ident: "leftovers"})
      );
      var damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "energy-ball"
      );
      expect([98, 102, 104, 108, 110, 114, 116]).toContain(damage);

      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "leftovers"}),
        Object.assign(quaquavalBuild, {item_ident: "assault-vest"})
      );

      var damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "energy-ball"
      );
      expect([66, 68, 72, 74, 78]).toContain(damage);
    });

  });

});
