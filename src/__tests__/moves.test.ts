import {
  TALONFLAME_ATEAM_BUILD,
  ANNIHILAPE_BULKY_BUILD
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";

import { BattleState } from "../models/battle/BattleState";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";

describe("MOVES", () => {
  let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
  let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);

  describe("ACROBATICS", () => {

    test("it deals damage with double BP if no item is held", () => {
      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(talonflameBuild, {item_ident: "leftovers"}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );
      var damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "acrobatics",
        0.85,
        0
      );
      expect(damage).toEqual(72);

      battleState = createNewBattleState1v1(
        Object.assign(talonflameBuild, {item_ident: null}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );
      var damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "acrobatics",
        0.85,
        0
      );
      expect(damage).toEqual(144);
    });

  })

});
