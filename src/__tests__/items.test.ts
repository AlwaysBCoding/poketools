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

  describe("DEFAULT_INTERACTION", () => {
    test("it calculates the damage correctly", () => {
      const battleState: BattleState = createNewBattleState1v1(meowscaradaBuild, quaquavalBuild);
      const damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "u-turn"
      );
      expect([21, 22, 23, 24, 25]).toContain(damage);
    });
  });

  describe("LIFE_ORB", () => {

    test("it multiplies the damage correctly", () => {
      meowscaradaBuild.item_ident = "life-orb";
      const battleState: BattleState = createNewBattleState1v1(meowscaradaBuild, quaquavalBuild);
      const damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "u-turn"
      );
      expect([27, 29, 30, 31, 32]).toContain(damage);
    });

  })

});
