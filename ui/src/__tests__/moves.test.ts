import {
  DRAGONITE_SIMPLE_BUILD,
  DRAGAPULT_SIMPLE_BUILD,
  AMPHAROS_SIMPLE_BUILD,
  TALONFLAME_ATEAM_BUILD,
  ANNIHILAPE_BULKY_BUILD,
  GRIMMSNARL_ATEAM_BUILD,
  GASTRODON_ATEAM_BUILD,
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS,
  GARCHOMP_ATEAM_BUILD,
  GHOLDENGO_ATEAM_BUILD,
  BAXCALIBUR_DEFAULT_BUILD
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";

import { BattleAction, composeMoveAction } from "../models/battle/BattleAction";
import { Battle, createBattle, initialStep } from "../models/battle/Battle";
import { BattleConfig } from "../models/battle/BattleShared";

import { calculateDamage } from "../models/battle/damage-calc";

const SERVER_URI = "http://localhost:8000";
const BATTLE_CONFIG: BattleConfig = {variant: "singles"};
const BATTLE_CONFIG_VGC: BattleConfig = {variant: "doubles"};

const PERFORM_BATTLE_ACTION = async (battle: Battle, battleAction: BattleAction, hardcodedStatChangeFrequencyRoll?: number): Promise<Record<string, any>> => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      battle: battle,
      battle_action: battleAction,
      hardcoded_stat_change_frequency_roll: hardcodedStatChangeFrequencyRoll,
      random_roll: 0.85,
      crit_roll: 0
    })
  }

  const response = await fetch(`${SERVER_URI}/test/perform-battle-action`, fetchOptions);
  const result = await response.json();
  return result;
}

const CALCULATE_DAMAGE = async (battle: Battle, battleAction: BattleAction, random_roll?: number, crit_roll?: number): Promise<Record<string, any>> => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      battle: battle,
      battle_action: battleAction,
      random_roll: random_roll ? random_roll : 0.85,
      crit_roll: crit_roll ? crit_roll : 0
    })
  }

  const response = await fetch(`${SERVER_URI}/test/calculate-damage`, fetchOptions);
  const result = await response.json();
  return result;

  // let damage = calculateDamage({
  //   battleState: battle.battle_state,
  //   attackingPokemon: battleAction.actor.battle_side === "blue" ? battle.battle_state.blue_side_pokemon[0] : battle.battle_state.red_side_pokemon[0],
  //   targetPokemon: battleAction.actor.battle_side === "blue" ? battle.battle_state.red_side_pokemon[0] : battle.battle_state.blue_side_pokemon[0],
  //   moveIdent: battleAction.action_data.move.ident,
  //   hardcodedRandomRoll: 0.85,
  //   hardcodedCritRoll: crit_roll ? crit_roll : 0
  // });
  // return { damage }
}

const BATTLE_STEP = async(battle: Battle, blueBattleActions: BattleAction[], redBattleActions: BattleAction[]): Promise<Record<string, any>> => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      battle: battle,
      blue_battle_actions: blueBattleActions,
      red_battle_actions: redBattleActions
    })
  }

  const response = await fetch(`${SERVER_URI}/test/battle-step`, fetchOptions);
  const result = await response.json();
  return result;
}

const ORDER_BATTLE_ACTIONS = async (battle: Battle, battleActions: BattleAction[]): Promise<Record<string, any>> => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      battle: battle,
      battle_actions: battleActions
    })
  }

  const response = await fetch(`${SERVER_URI}/test/order-actions`, fetchOptions);
  const result = await response.json();
  return result;
}

describe("MOVES", () => {

  describe("ACROBATICS", () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [annihilapeBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const acrobaticsAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "acrobatics",
      ["red-field-1"]
    );

    test("it normal damage if an item is held", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].item_ident = "leftovers";
      const acrobaticsActionDamageResult = await CALCULATE_DAMAGE(initialBattleCopy, acrobaticsAction);
      expect(acrobaticsActionDamageResult.damage).toEqual(72);
    });

    test("it deals damage with double BP if no item is held", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].item_ident = null;
      const acrobaticsActionDamageResult = await CALCULATE_DAMAGE(initialBattleCopy, acrobaticsAction);
      expect(acrobaticsActionDamageResult.damage).toEqual(144);
    });

  });

  // ATOMIC STAT BOOSTS
  describe("ANCIENT POWER", () => {
    let gastrodonBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GASTRODON_ATEAM_BUILD);
    gastrodonBuild.move_idents = ["clear-smog", "hydro-pump", "earth-power", "ancient-power"];
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [gastrodonBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const ancientPowerAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "ancient-power",
      ["red-field-1"]
    );

    test("it boosts all stats if frequency roll is proc'd", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const ancientPowerActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, ancientPowerAction, 1);
      expect(ancientPowerActionResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.attack).toEqual(1);
      expect(ancientPowerActionResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.defense).toEqual(1);
      expect(ancientPowerActionResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_attack).toEqual(1);
      expect(ancientPowerActionResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_defense).toEqual(1);
      expect(ancientPowerActionResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.speed).toEqual(1);
    });
  });

  describe("AQUA STEP", () => {
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const aquaStepAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "aqua-step",
      ["red-field-1"]
    );

    const energyBallAction: BattleAction = composeMoveAction(
      "red-field-1",
      "energy-ball",
      ["blue-field-1"]
    );

    test("it boosts quaquaval's speed after use", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.red_side_pokemon[0].stat_boosts.special_attack = -2;
      const initialOrderedActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [aquaStepAction, energyBallAction]);
      expect(initialOrderedActionsResult.battle_actions[0].slot).toEqual("red-field-1");
      const battleStepResult = await BATTLE_STEP(initialBattleCopy, [aquaStepAction], [energyBallAction]);
      expect(battleStepResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.speed).toEqual(1);
      const nextAquaStepAction: BattleAction = composeMoveAction(
        "blue-field-1",
        "aqua-step",
        ["red-field-1"]
      );
      const nextOrderedActionsResult = await ORDER_BATTLE_ACTIONS(battleStepResult.battle, [nextAquaStepAction, energyBallAction]);
      expect(nextOrderedActionsResult.battle_actions[0].slot).toEqual("blue-field-1");
    });

  });

  // aValue
  describe("BODY PRESS", () => {
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    grimmsnarlBuild.move_idents = ['body-press', 'spirit-break', 'reflect', 'light-screen'];

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const bodyPressAction: BattleAction = composeMoveAction(
      "red-field-1",
      "body-press",
      ["blue-field-1"]
    );

    test("it deals damage with an increased attack stat", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.red_side_pokemon[0].stat_boosts.defense = 3;
      const bodyPressActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, bodyPressAction);
      expect(bodyPressActionDamage.damage).toEqual(64);
    });
  });

  // MOVE DOESNT LOWER STATS IF 0 DAMAGE / FAILS
  describe("CLOSE COMBAT", () => {
    // TODO: IMPLEMENT
  });

  // RECOVERY
  describe("DRAIN PUNCH", () => {
    let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [annihilapeBuild],
      redSidePokemonBuilds: [talonflameBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const drainPunchAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "drain-punch",
      ["red-field-1"]
    );

    test("it recovers the proper amount of recovery hp", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].current_hp = 100;
      const drainPunchActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, drainPunchAction);
      expect(drainPunchActionResult.battle.battle_state.red_side_pokemon[0].current_hp).toEqual(122);
      expect(drainPunchActionResult.battle.battle_state.blue_side_pokemon[0].current_hp).toEqual(116);
    });

    test("there is no recovery amount if hp is full", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const drainPunchActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, drainPunchAction);
      expect(drainPunchActionResult.battle.battle_state.red_side_pokemon[0].current_hp).toEqual(122);
      expect(drainPunchActionResult.battle.battle_state.blue_side_pokemon[0].current_hp).toEqual(217);
    });

  });

  // SPREAD DAMAGE
  describe("EARTHQUAKE", () => {
    let garchompBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GARCHOMP_ATEAM_BUILD);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    let gholdengoBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GHOLDENGO_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG_VGC,
      blueSidePokemonBuilds: [garchompBuild, grimmsnarlBuild],
      redSidePokemonBuilds: [gholdengoBuild, meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const earthquakeAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "earthquake",
      ["blue-field-2", "red-field-1", "red-field-2"]
    );

    test("it damages multiple pokemon on the same turn", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const earthquakeActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, earthquakeAction);
      initialBattle.battle_state.red_side_pokemon[0].item_ident = "choice-specs";
      expect(earthquakeActionResult.battle.battle_state.blue_side_pokemon[0].current_hp).toEqual(184);
      expect(earthquakeActionResult.battle.battle_state.blue_side_pokemon[1].current_hp).toEqual(65);
      expect(earthquakeActionResult.battle.battle_state.red_side_pokemon[0].current_hp).toEqual(0);
      expect(earthquakeActionResult.battle.battle_state.red_side_pokemon[1].current_hp).toEqual(91);
    });

  });

  // TERRAIN
  describe("ELECTRIC TERRAIN", () => {
    const ampharosBuildTemplate = AMPHAROS_SIMPLE_BUILD;
    ampharosBuildTemplate.move_idents = ["volt-switch", "thunderbolt", "focus-blast", "electric-terrain"];
    let ampharosBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ampharosBuildTemplate);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [ampharosBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const electricTerrainAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "electric-terrain",
      ["field"]
    );

    const spiritBreakAction: BattleAction = composeMoveAction(
      "red-field-1",
      "spirit-break",
      ["blue-field-1"]
    );

    test("it sets electric terrain", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const electricTerrainActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, electricTerrainAction);
      expect(electricTerrainActionResult.battle.battle_state.global_state.terrain).toEqual("electric");
      expect(electricTerrainActionResult.battle.battle_state.global_state.terrain_counter).toEqual(5);
    });

    test("it doesn't set electric terrain if electric terrain is already set", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.global_state.terrain = "electric";
      initialBattleCopy.battle_state.global_state.terrain_counter = 3;
      const electricTerrainActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, electricTerrainAction);
      expect(electricTerrainActionResult.battle.battle_state.global_state.terrain).toEqual("electric");
      expect(electricTerrainActionResult.battle.battle_state.global_state.terrain_counter).toEqual(3);
    });

    test("it properly decrements the terrain counter at the end of the turn", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const battleStepResult = await BATTLE_STEP(initialBattleCopy, [electricTerrainAction], [spiritBreakAction]);
      expect(battleStepResult.battle.battle_state.global_state.terrain).toEqual("electric");
      expect(battleStepResult.battle.battle_state.global_state.terrain_counter).toEqual(4);
    });

  });

  // PRIORITY
  describe("EXTREME SPEED", () => {
    let dragoniteBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(DRAGONITE_SIMPLE_BUILD);
    let dragapultBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(DRAGAPULT_SIMPLE_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [dragoniteBuild],
      redSidePokemonBuilds: [dragapultBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const gigaImpactAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "giga-impact",
      ["red-field-1"]
    );

    const extremeSpeedAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "extreme-speed",
      ["red-field-1"]
    );

    const dracoMeteorAction: BattleAction = composeMoveAction(
      "red-field-1",
      "draco-meteor",
      ["blue-field-1"]
    );

    const quickAttackAction: BattleAction = composeMoveAction(
      "red-field-1",
      "quick-attack",
      ["blue-field-1"]
    );

    const dragonTailAction: BattleAction = composeMoveAction(
      "red-field-1",
      "dragon-tail",
      ["blue-field-1"]
    );

    test("it correctly orders boosted speed ahead in the same priority bracket", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].stat_boosts.speed = 4;
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [gigaImpactAction, dracoMeteorAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual('blue-field-1');
    });

    test("it places priority 1 over boosted priority 0 speed", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].stat_boosts.speed = 4;
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [gigaImpactAction, quickAttackAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual('red-field-1');
    });

    test("it places priority 2 over priority 1", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].stat_boosts.speed = 4;
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [extremeSpeedAction, quickAttackAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual('blue-field-1');
    });

    test("it respects negative priorities", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [gigaImpactAction, dragonTailAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual('blue-field-1');
    });

  });

  // RECOIL DAMAGE
  describe("FLARE BLITZ", () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const flareBlitzAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "flare-blitz",
      ["red-field-1"]
    );

    test("it deals the proper amount of recoil damage", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const flareBlitzActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, flareBlitzAction);
      expect(flareBlitzActionResult.battle.battle_state.red_side_pokemon[0].current_hp).toEqual(78);
      expect(flareBlitzActionResult.battle.battle_state.blue_side_pokemon[0].current_hp).toEqual(115);
    });

    test("it can knock itself out with recoil damage", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].current_hp = 10;
      const flareBlitzActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, flareBlitzAction);
      expect(flareBlitzActionResult.battle.battle_state.blue_side_pokemon[0].location).toEqual('graveyard');
    });

  });

  // CUSTOM TYPE DAMAGE
  describe("FLYING PRESS", () => {
    // TODO: IMPLEMENT
  });

  // CRIT STAGE CHANGE
  describe("FOCUS ENERGY", () => {
    let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);
    annihilapeBuild.move_idents = ["bulk-up", "drain-punch", "rage-fist", "focus-energy"];
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [annihilapeBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const focusEnergyAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "focus-energy",
      ["blue-field-1"]
    );

    test("it boosts the user's crit ratio", async () => {
      const focusEnergyActionResult = await PERFORM_BATTLE_ACTION(initialBattle, focusEnergyAction);
      expect(focusEnergyActionResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.critical_hit).toEqual(2);
    });

  });

  // aValue
  describe("FOUL PLAY", () => {
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    quaquavalBuild.stat_spread.attack = 189;
    grimmsnarlBuild.move_idents = ['foul-play', 'spirit-break', 'reflect', 'light-screen'];

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const foulPlayAction: BattleAction = composeMoveAction(
      "red-field-1",
      "foul-play",
      ["blue-field-1"]
    );

    test("it deals damage with an increased attack stat", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const foulPlayActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, foulPlayAction);
      expect(foulPlayActionDamage.damage).toEqual(51);
    });
  });

  // CUSTOM TYPE DAMAGE
  describe("FREEZE DRY", () => {
    let baxcaliburBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(BAXCALIBUR_DEFAULT_BUILD);
    let gastrodonBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GASTRODON_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [baxcaliburBuild],
      redSidePokemonBuilds: [gastrodonBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const freezeDryAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "freeze-dry",
      ["red-field-1"]
    );

    test("it deals super effective type damage to water pokemon", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const freezeDryActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, freezeDryAction);
      expect(freezeDryActionResult.battle.battle_state.red_side_pokemon[0].current_hp).toEqual(110);
    });
  });

  describe("KNOCK OFF", () => {
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [grimmsnarlBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const knockOffAction: BattleAction = composeMoveAction(
      "red-field-1",
      "knock-off",
      ["blue-field-1"]
    );

    test("the base power of the move is multiplied by 1.5 if the target has an item that can be removed", async () => {
      const knockOffActionDamageResult = await CALCULATE_DAMAGE(initialBattle, knockOffAction);
      expect(knockOffActionDamageResult.damage).toEqual(26);
    });

    test("the target has it's item removed if hit by the move", async () => {
      const knockOffActionResult = await PERFORM_BATTLE_ACTION(initialBattle, knockOffAction);
      const nextBattle = knockOffActionResult.battle;
      expect(nextBattle.battle_state.blue_side_pokemon[0].item_ident).toEqual(null);
    });

    test("the base power is not multiplied if the target does not have an item", async () => {
      const knockOffActionResult = await PERFORM_BATTLE_ACTION(initialBattle, knockOffAction);
      const secondKnockOffActionDamageResult = await CALCULATE_DAMAGE(knockOffActionResult.battle, knockOffAction);
      expect(secondKnockOffActionDamageResult.damage).toEqual(17);
    });

  });

  describe("LIGHT SCREEN", () => {
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [grimmsnarlBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const lightScreenAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "light-screen",
      ["blue-field-1"]
    );

    const energyBallAction: BattleAction = composeMoveAction(
      "red-field-1",
      "energy-ball",
      ["blue-field-1"]
    );

    test("it sets light screen", async () => {
      const lightScreenActionResult = await PERFORM_BATTLE_ACTION(initialBattle, lightScreenAction);
      expect(lightScreenActionResult.battle.battle_state.blue_side_state.light_screen).toEqual(5);
    });

    test("special damage halves when light screen is active", async () => {
      const lightScreenActionResult = await PERFORM_BATTLE_ACTION(initialBattle, lightScreenAction);
      const energyBallActionResult = await CALCULATE_DAMAGE(lightScreenActionResult.battle, energyBallAction);

      expect(energyBallActionResult.damage).toEqual(21);
    });

    test("critical hits go through light screen", async () => {
      const lightScreenActionResult = await PERFORM_BATTLE_ACTION(initialBattle, lightScreenAction);
      const energyBallDamageResult = await CALCULATE_DAMAGE(lightScreenActionResult.battle, energyBallAction, 0.85, 1);

      expect(energyBallDamageResult.damage).toEqual(64);
    });

    test("it doesn't reset light screen counter if light screen is already active", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_state.light_screen = 3;
      const lightScreenActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, lightScreenAction);
      expect(lightScreenActionResult.battle.battle_state.blue_side_state.light_screen).toEqual(3);
    });

    test("it properly decrements the light screen counter at the end of the turn", async () => {
      const battleStepResult = await BATTLE_STEP(initialBattle, [lightScreenAction], [energyBallAction]);
      expect(battleStepResult.battle.battle_state.blue_side_state.light_screen).toEqual(4);
    });

  });

  // dValue
  describe("PSYSHOCK", () => {
    let gholdengoBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GHOLDENGO_ATEAM_BUILD);
    let gastrodonBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GASTRODON_ATEAM_BUILD);
    gholdengoBuild.move_idents = ["shadow-ball", "thunderbolt", "make-it-rain", "psyshock"];

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [gholdengoBuild],
      redSidePokemonBuilds: [gastrodonBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const psyshockAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "psyshock",
      ["red-field-1"]
    );

    test("it calculates damage using target's defense stat", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const psyshockActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, psyshockAction);
      expect(psyshockActionDamage.damage).toEqual(64);
    });
  });

  describe("REFLECT", () => {
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [grimmsnarlBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const reflectAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "reflect",
      ["blue-field-1"]
    );

    const knockOffAction: BattleAction = composeMoveAction(
      "red-field-1",
      "knock-off",
      ["blue-field-1"]
    );

    const flowerTrickAction: BattleAction = composeMoveAction(
      "red-field-1",
      "flower-trick",
      ["blue-field-1"]
    );

    test("it sets reflect", async () => {
      const reflectActionResult = await PERFORM_BATTLE_ACTION(initialBattle, reflectAction);
      expect(reflectActionResult.battle.battle_state.blue_side_state.reflect).toEqual(5);
    });

    test("physical damage halves when reflect is active", async () => {
      const reflectActionResult = await PERFORM_BATTLE_ACTION(initialBattle, reflectAction);
      const knockOffActionDamageResult = await CALCULATE_DAMAGE(reflectActionResult.battle, knockOffAction);

      expect(knockOffActionDamageResult.damage).toEqual(13);
    });

    test("critical hits go through reflect", async () => {
      const reflectActionResult = await PERFORM_BATTLE_ACTION(initialBattle, reflectAction);
      const flowerTrickDamageResult = await CALCULATE_DAMAGE(reflectActionResult.battle, flowerTrickAction);

      expect(flowerTrickDamageResult.damage).toEqual(114);
    });

    test("it doesn't reset reflect counter if reflect is already active", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_state.reflect = 3;
      const reflectActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, reflectAction);
      expect(reflectActionResult.battle.battle_state.blue_side_state.reflect).toEqual(3);
    });

    test("it properly decrements the reflect counter at the end of the turn", async () => {
      const battleStepResult = await BATTLE_STEP(initialBattle, [reflectAction], [knockOffAction]);
      expect(battleStepResult.battle.battle_state.blue_side_state.reflect).toEqual(4);
    });

  });

  // WEATHER
  describe("SUNNY DAY", () => {
    const talonflameBuildTemplate = TALONFLAME_ATEAM_BUILD;
    talonflameBuildTemplate.move_idents = ["tailwind", "brave-bird", "sunny-day", "flare-blitz"];
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(talonflameBuildTemplate);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const sunnyDayAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "sunny-day",
      ["field"]
    );

    const spiritBreakAction: BattleAction = composeMoveAction(
      "red-field-1",
      "spirit-break",
      ["blue-field-1"]
    );

    test("it sets sun weather", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const sunnyDayActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, sunnyDayAction);
      expect(sunnyDayActionResult.battle.battle_state.global_state.weather).toEqual("sun");
      expect(sunnyDayActionResult.battle.battle_state.global_state.weather_counter).toEqual(5);
    });

    test("it doesn't set sun weather if sun is already set", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.global_state.weather = "sun";
      initialBattleCopy.battle_state.global_state.weather_counter = 3;
      const sunnyDayActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, sunnyDayAction);
      expect(sunnyDayActionResult.battle.battle_state.global_state.weather).toEqual("sun");
      expect(sunnyDayActionResult.battle.battle_state.global_state.weather_counter).toEqual(3);
    });

    test("it properly decrements the weather counter at the end of the turn", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const battleStepResult = await BATTLE_STEP(initialBattleCopy, [sunnyDayAction], [spiritBreakAction]);
      expect(battleStepResult.battle.battle_state.global_state.weather).toEqual("sun");
      expect(battleStepResult.battle.battle_state.global_state.weather_counter).toEqual(4);
    });
  });

  describe("TAILWIND", () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const tailwindAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "tailwind",
      ["blue-field-1"]
    );

    const knockOffAction: BattleAction = composeMoveAction(
      "red-field-1",
      "knock-off",
      ["blue-field-1"]
    );

    test("it sets tailwind", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const tailwindActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, tailwindAction);
      expect(tailwindActionResult.battle.battle_state.blue_side_state.tailwind).toEqual(4);
    });

    test("speed is doubled under tailwind", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].ability_ident = "flame-body";
      const initialOrderedActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [tailwindAction, knockOffAction]);
      expect(initialOrderedActionsResult.battle_actions[0].slot).toEqual("red-field-1");
      const tailwindActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, tailwindAction);
      const tailwindOrderedActionsResult = await ORDER_BATTLE_ACTIONS(tailwindActionResult.battle, [tailwindAction, knockOffAction]);
      expect(tailwindOrderedActionsResult.battle_actions[0].slot).toEqual("blue-field-1");
    });

    test("it doesn't reset tailwind counter if tailwind is already active", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_state.tailwind = 3;
      const reflectActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, tailwindAction);
      expect(reflectActionResult.battle.battle_state.blue_side_state.tailwind).toEqual(3);
    });

    test("it properly decrements the tailwind counter at the end of the turn", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const battleStepResult = await BATTLE_STEP(initialBattleCopy, [tailwindAction], [knockOffAction]);
      expect(battleStepResult.battle.battle_state.blue_side_state.tailwind).toEqual(3);
    });

  });

});
