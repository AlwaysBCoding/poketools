import {
  TALONFLAME_ATEAM_BUILD,
  ANNIHILAPE_BULKY_BUILD,
  GRIMMSNARL_ATEAM_BUILD,
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";

import { BattleAction, composeMoveAction } from "../models/battle/BattleAction";
import { Battle, createBattle, initialStep } from "../models/battle/Battle";
import { BattleConfig } from "../models/battle/BattleShared";

const SERVER_URI = "http://localhost:8000";
const BATTLE_CONFIG: BattleConfig = {variant: "singles"};

const PERFORM_BATTLE_ACTION = async (battle: Battle, battleAction: BattleAction): Promise<Record<string, any>> => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      battle: battle,
      battle_action: battleAction
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
      initialBattle.battle_state.blue_side_pokemon[0],
      "acrobatics",
      ["red-field-1"]
    );

    test("it normal damage if an item is held", async () => {
      const acrobaticsActionCopy = JSON.parse(JSON.stringify(acrobaticsAction));
      acrobaticsActionCopy.actor.item_ident = "leftovers";
      const acrobaticsActionDamageResult = await CALCULATE_DAMAGE(initialBattle, acrobaticsActionCopy);
      expect(acrobaticsActionDamageResult.damage).toEqual(72);
    });

    test("it deals damage with double BP if no item is held", async () => {
      const acrobaticsActionCopy = JSON.parse(JSON.stringify(acrobaticsAction));
      acrobaticsActionCopy.actor.item_ident = null;
      const acrobaticsActionDamageResult = await CALCULATE_DAMAGE(initialBattle, acrobaticsActionCopy);
      expect(acrobaticsActionDamageResult.damage).toEqual(144);
    });

  });

  describe("AQUA STEP", () => {
  });

  describe("KNOCK-OFF", () => {
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [grimmsnarlBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const knockOffAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
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
      initialBattle.battle_state.blue_side_pokemon[0],
      "light-screen",
      ["blue-field-1"]
    );

    const energyBallAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
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
      initialBattle.battle_state.blue_side_pokemon[0],
      "reflect",
      ["blue-field-1"]
    );

    const knockOffAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
      "knock-off",
      ["blue-field-1"]
    );

    const flowerTrickAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
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
      initialBattle.battle_state.blue_side_pokemon[0],
      "tailwind",
      ["blue-field-1"]
    );

    const knockOffAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
      "knock-off",
      ["blue-field-1"]
    );

    test("it sets tailwind", async () => {
      const tailwindActionResult = await PERFORM_BATTLE_ACTION(initialBattle, tailwindAction);
      expect(tailwindActionResult.battle.battle_state.blue_side_state.tailwind).toEqual(4);
    });

    test("speed is doubled under tailwind", async () => {
      const initialOrderedActionsResult = await ORDER_BATTLE_ACTIONS(initialBattle, [tailwindAction, knockOffAction]);
      expect(initialOrderedActionsResult.battle_actions[0].actor.pokemon_build.pokemon.ident).toEqual("meowscarada");
      const tailwindActionResult = await PERFORM_BATTLE_ACTION(initialBattle, tailwindAction);
      const tailwindOrderedActionsResult = await ORDER_BATTLE_ACTIONS(tailwindActionResult.battle, [tailwindAction, knockOffAction]);
      expect(tailwindOrderedActionsResult.battle_actions[0].actor.pokemon_build.pokemon.ident).toEqual("talonflame");
    });

    test("it doesn't reset tailwind counter if tailwind is already active", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_state.tailwind = 3;
      const reflectActionResult = await PERFORM_BATTLE_ACTION(initialBattleCopy, tailwindAction);
      expect(reflectActionResult.battle.battle_state.blue_side_state.tailwind).toEqual(3);
    });

    test("it properly decrements the tailwind counter at the end of the turn", async () => {
      const battleStepResult = await BATTLE_STEP(initialBattle, [tailwindAction], [knockOffAction]);
      expect(battleStepResult.battle.battle_state.blue_side_state.tailwind).toEqual(3);
    });

  });

});
