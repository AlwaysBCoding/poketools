import {
  MEOWSCARADA_MAX_STATS,
  QUAXWELL_MAX_STATS,
  QUAQUAVAL_MAX_STATS,
  TALONFLAME_ATEAM_BUILD,
  ANNIHILAPE_BULKY_BUILD
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";

import { BattleState } from "../models/battle/BattleState";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";

describe("ITEMS", () => {
  let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
  let quaxwellBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAXWELL_MAX_STATS);
  let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
  let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
  let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);

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

  describe("EVIOLITE", () => {

    test ("it reduces the damage correctly", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "leftovers"}),
        Object.assign(quaxwellBuild, {item_ident: "leftovers"})
      );
      let damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "energy-ball",
        0.85
      );
      expect(damage).toEqual(116);

      battleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "leftovers"}),
        Object.assign(quaxwellBuild, {item_ident: "eviolite"})
      );

      damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "energy-ball",
        0.85
      );
      expect(damage).toEqual(78);
    })

    test("it doesn't work on fully evolved mons", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "leftovers"}),
        Object.assign(quaquavalBuild, {item_ident: "leftovers"})
      );
      let damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "energy-ball",
        0.85
      );
      expect(damage).toEqual(98);

      battleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "leftovers"}),
        Object.assign(quaquavalBuild, {item_ident: "eviolite"})
      );

      damage = calculateDamage(
        battleState,
        battleState.blue_side_pokemon[0],
        battleState.red_side_pokemon[0],
        "energy-ball",
        0.85
      );
      expect(damage).toEqual(98);
    });

  });

  describe("1.2x TYPE BOOSTING ITEMS", () => {

    describe("SHARP_BEAK", () => {

      it("boosts the damage correctly", () => {
        let battleState: BattleState = createNewBattleState1v1(
          Object.assign(talonflameBuild, {item_ident: "leftovers"}),
          Object.assign(annihilapeBuild, {item_ident: "leftovers"})
        );

        let damage = calculateDamage(
          battleState,
          battleState.blue_side_pokemon[0],
          battleState.red_side_pokemon[0],
          "brave-bird",
          0.85
        );
        expect(damage).toEqual(156);

        battleState = createNewBattleState1v1(
          Object.assign(talonflameBuild, {item_ident: "sharp-beak"}),
          Object.assign(annihilapeBuild, {item_ident: "leftovers"})
        );
        damage = calculateDamage(
          battleState,
          battleState.blue_side_pokemon[0],
          battleState.red_side_pokemon[0],
          "brave-bird",
          0.85
        );
        expect(damage).toEqual(186);
      });

    })

  });

});
