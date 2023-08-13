import {
  GRIMMSNARL_ATEAM_BUILD,
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS,
  TALONFLAME_ATEAM_BUILD
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";

import { BattleAction, composeMoveAction } from "../models/battle/BattleAction";
import { Battle, createBattle, initialStep } from "../models/battle/Battle";
import { BattleConfig } from "../models/battle/BattleShared";

import { calculateDamage } from "../models/battle/damage-calc";

const SERVER_URI = "http://localhost:8000";
const BATTLE_CONFIG: BattleConfig = {variant: "singles"};

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

describe("ABILITIES", () => {

  // NO COMPETITIVE USE
  // =====================
  // HONEY GATHER

  // COMPETITIVE USE
  // =====================
  describe("ADAPTABILITY", () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [quaquavalBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const flareBlitzAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "flare-blitz",
      ["red-field-1"]
    );

    test("super effective attacks have increased STAB", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].ability_ident = 'adaptability';
      const flareBlitzActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, flareBlitzAction);
      expect(flareBlitzActionDamage.damage).toEqual(67);
    });

  });

  describe("BLAZE, OVERGROW, TORRENT", () => {
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const aquaStepAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "aqua-step",
      ["red-field-1"]
    );

    test("it deals increased damage with < 1/3rd HP", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].ability_ident = 'torrent';
      initialBattleCopy.battle_state.blue_side_pokemon[0].current_hp = 5;
      const aquaStepActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, aquaStepAction);
      expect(aquaStepActionDamage.damage).toEqual(136);
    });
  });

  describe("GALE WINGS", () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const braveBirdAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "brave-bird",
      ["red-field-1"]
    );

    const flareBlitzAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "flare-blitz",
      ["red-field-1"]
    );

    const flowerTrickAction: BattleAction = composeMoveAction(
      "red-field-1",
      "flower-trick",
      ["blue-field-1"]
    );

    test("it moves first with brave bird at full hp", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [braveBirdAction, flowerTrickAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual("blue-field-1");
    });

    test("it moves second with brave bird at half hp", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].current_hp = 77;
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [braveBirdAction, flowerTrickAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual("red-field-1");
    });

    test("it moves second with flare blitz at full hp", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [flareBlitzAction, flowerTrickAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual("red-field-1");
    });

  });

  describe("HUGE POWER", () => {
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [grimmsnarlBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const aquaStepAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "aqua-step",
      ["red-field-1"]
    );

    test("it deals damage with an increased attack stat", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].ability_ident = 'huge-power';
      const aquaStepActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, aquaStepAction);
      expect(aquaStepActionDamage.damage).toEqual(183);
    });
  });

  describe("PRANKSTER", () => {
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    grimmsnarlBuild.move_idents = ["reflect", "light-screen", "thunder-wave", "spirit-break"];
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
      ["field"]
    );

    const thunderWaveAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "thunder-wave",
      ["red-field-1"]
    );

    const spiritBreakAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "spirit-break",
      ["red-field-1"]
    );

    const flowerTrickAction: BattleAction = composeMoveAction(
      "red-field-1",
      "flower-trick",
      ["blue-field-1"]
    );

    test("it moves first with prankster reflect", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [reflectAction, flowerTrickAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual("blue-field-1");
    });

    test("it moves second with prankster spirit break", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [spiritBreakAction, flowerTrickAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual("red-field-1");
    });

    test("it moves first with prankster thunder wave, but prankster thunder wave fails against a dark type", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      const orderedBattleActionsResult = await ORDER_BATTLE_ACTIONS(initialBattleCopy, [thunderWaveAction, flowerTrickAction]);
      expect(orderedBattleActionsResult.battle_actions[0].slot).toEqual("blue-field-1");
      // TODO: IMPLEMENT THUNDER WAVE FAILING LOGIC
    });

  });

});
