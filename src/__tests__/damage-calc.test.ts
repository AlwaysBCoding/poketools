import {
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./__factories__/pokemon.factory";

import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";
import { BattleState } from "../models/battle/BattleState";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";

describe("DAMAGE_CALC", () => {
  var meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS)!;
  var quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS)!;

  test("it runs the test", () => {
    const battleState: BattleState = createNewBattleState1v1(meowscaradaBuild, quaquavalBuild);
    const result = calculateDamage(
      battleState,
      battleState.blue_side_pokemon[0],
      battleState.red_side_pokemon[0],
      "u-turn"
    );
    expect([21, 22, 23, 24, 25]).toContain(result);
  });

});
