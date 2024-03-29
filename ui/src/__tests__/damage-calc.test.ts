import {
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS,
  TALONFLAME_ATEAM_BUILD,
  GHOLDENGO_ATEAM_BUILD,
  GARCHOMP_ATEAM_BUILD,
  ANNIHILAPE_BULKY_BUILD
} from "./__factories__/pokemon.factory";

import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";
import { BattleState } from "../models/battle/BattleState";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";

describe("DAMAGE_CALC", () => {

  describe("BURN", () => {
    test("it reduces the damage correctly", () => {
      let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
      let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "life-orb"}),
        Object.assign(quaquavalBuild, {item_ident: "leftovers"})
      );
      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "u-turn",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(27);

      meowscaradaBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
      quaquavalBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
      battleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {item_ident: "life-orb"}),
        Object.assign(quaquavalBuild, {item_ident: "leftovers"})
      );
      battleState.blue_side_pokemon[0].status = "burned";
      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "u-turn",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(13);
    });
  });

  describe("TERA_TYPES", () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);
    let gholdengoBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GHOLDENGO_ATEAM_BUILD);

    test("it correctly takes defensive tera types into account", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(talonflameBuild, {item_ident: "sharp-beak"}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "brave-bird",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(186);

      battleState = createNewBattleState1v1(
        Object.assign(talonflameBuild, {item_ident: "sharp-beak"}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );

      battleState.red_side_pokemon[0].terastallized = true;

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "brave-bird",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(93);
    });

    test("it correctly adds 2x STAB when terastallizing into an existing type", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(talonflameBuild, {item_ident: "sharp-beak"}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "brave-bird",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(186);

      battleState = createNewBattleState1v1(
        Object.assign(talonflameBuild, {item_ident: "sharp-beak"}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );

      battleState.blue_side_pokemon[0].terastallized = true;

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "brave-bird",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(248);
    });

    test("it correctly adds 1.5x STAB when terastallizing into a different type", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "thunderbolt",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(51);

      battleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {tera_type_ident: "electric"}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );

      battleState.blue_side_pokemon[0].terastallized = true;

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "thunderbolt",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(76);
    });

  });

  describe("STAT_BOOSTS", () => {
    let gholdengoBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GHOLDENGO_ATEAM_BUILD);
    let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);

    test("it correctly increases damage for attacking stat boosts", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.blue_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: 0, special_defense: 0, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(134);

      battleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.blue_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: 1, special_defense: 0, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(200);
    });

    test("it correctly reduces damage for negative attacking stat boosts", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.blue_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: 0, special_defense: 0, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(134);

      battleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.blue_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: -1, special_defense: 0, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(90);
    });

    test("it correctly increases damage for negative defensive stat boosts", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.red_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: 0, special_defense: 0, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(134);

      battleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.red_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: 0, special_defense: -1, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(200);
    });

    test("it correctly reduces damage for positive defending stat boosts", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.red_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: 0, special_defense: 0, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(134);

      battleState = createNewBattleState1v1(
        Object.assign(gholdengoBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      battleState.red_side_pokemon[0].stat_boosts = {attack: 0, defense: 0, special_attack: 0, special_defense: 1, speed: 0, accuracy: 0, evasiveness: 0, critical_hit: 0};

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "shadow-ball",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0
      });
      expect(damage).toEqual(90);
    });

  });

  describe("SPREAD_DAMAGE", () => {
    let garchompBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GARCHOMP_ATEAM_BUILD);
    let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);

    test("it correctly reduces damage for spread attacks", () => {
      let battleState: BattleState = createNewBattleState1v1(
        Object.assign(garchompBuild, {item_ident: "leftovers"}),
        Object.assign(annihilapeBuild, {item_ident: "leftovers"})
      );

      let damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "earthquake",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0,
        hardcodedTargetingValue: "single"
      });
      expect(damage).toEqual(90);

      battleState = createNewBattleState1v1(
        Object.assign(garchompBuild, {}),
        Object.assign(annihilapeBuild, {})
      );

      damage = calculateDamage({
        battleState: battleState,
        attackingPokemon: battleState.blue_side_pokemon[0],
        targetPokemon: battleState.red_side_pokemon[0],
        moveIdent: "earthquake",
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: 0,
        hardcodedTargetingValue: "spread"
      });
      expect(damage).toEqual(67);
    });

  });

});
