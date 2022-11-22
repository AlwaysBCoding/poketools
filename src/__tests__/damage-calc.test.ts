import {
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./__factories__/pokemon.factory";

import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";
import { BattleState } from "../models/battle/BattleState";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";

describe("DAMAGE_CALC", () => {

  describe("BURN", () => {
    test("it reduces the damage correctly", () => {
      var meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
      var quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
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

      var meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
      var quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "life-orb"}),
        Object.assign(quaquavalBuild, {item_ident: "leftovers"})
      );
      battleState.blue_side_pokemon[0].status = "burned";
      var damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "u-turn"
      );
      expect([13, 14, 16]).toContain(damage);
    });
  });

});
