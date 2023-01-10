import {
  MEOWSCARADA_MAX_STATS,
  QUAXWELL_MAX_STATS,
  QUAQUAVAL_MAX_STATS,
  TALONFLAME_ATEAM_BUILD,
  GARCHOMP_ATEAM_BUILD,
  ANNIHILAPE_BULKY_BUILD
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";

import { BattleState } from "../models/battle/BattleState";
import { BattleConfig } from "../models/battle/BattleShared";
import { BattleAction, composeMoveAction } from "../models/battle/BattleAction";
import { Battle, createBattle, initialStep } from "../models/battle/Battle";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";
import { Pokemon } from "../models/pokemon/Pokemon";

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

describe("ITEMS", () => {

  describe("1.2x TYPE BOOSTING ITEMS", () => {

    describe("SHARP_BEAK", () => {
      let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
      let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);

      let createdBattle: Battle = createBattle({
        config: BATTLE_CONFIG,
        blueSidePokemonBuilds: [talonflameBuild],
        redSidePokemonBuilds: [annihilapeBuild]
      });
      let initialBattle: Battle = initialStep(createdBattle);

      const braveBirdAction: BattleAction = composeMoveAction(
        initialBattle.battle_state.blue_side_pokemon[0],
        "brave-bird",
        ["red-field-1"]
      );

      test("it boosts the damage correctly", async () => {
        const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
        initialBattleCopy.battle_state.blue_side_pokemon[0].item_ident = 'sharp-beak';
        const braveBirdActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, braveBirdAction);
        expect(braveBirdActionDamage.damage).toEqual(186);
      });

    })

  });

  describe("ASSAULT_VEST", () => {
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const energyBallAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
      "energy-ball",
      ["blue-field-1"]
    );

    test("it reduces the damage correctly", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].item_ident = "assault-vest";
      const energyBallActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, energyBallAction);
      expect(energyBallActionDamage.damage).toEqual(66);
    });

  });

  describe("CHOICE BAND", () => {
    // TODO: IMPLEMENT DAMAGE CALCS
  });

  describe("CHOICE SCARF", () => {
    // TODO: IMPLEMENT SPEED CALCS
  });

  describe("CHOICE SPECS", () => {
    // TODO: IMPLEMENT DAMAGE CALCS
  });

  describe("EVIOLITE", () => {
    let quaxwellBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAXWELL_MAX_STATS);
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaxwellBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    let createdBattle2: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle2: Battle = initialStep(createdBattle2);

    const energyBallAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
      "energy-ball",
      ["blue-field-1"]
    );

    const energyBallAction2: BattleAction = composeMoveAction(
      initialBattle2.battle_state.red_side_pokemon[0],
      "energy-ball",
      ["blue-field-1"]
    );

    test ("it reduces the damage correctly", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].item_ident = 'eviolite';
      const energyBallActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, energyBallAction);
      expect(energyBallActionDamage.damage).toEqual(78);
    })

    test("it doesn't work on fully evolved mons", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle2));
      initialBattleCopy.battle_state.blue_side_pokemon[0].item_ident = 'eviolite';
      const energyBallActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, energyBallAction2);
      expect(energyBallActionDamage.damage).toEqual(98);
    });

  });

  describe("IRON_BALL", () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    let garchompBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GARCHOMP_ATEAM_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [garchompBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const earthquakeAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
      "earthquake",
      ["blue-field-1"]
    );

    test("hits flying pokemon for neutral damage", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.blue_side_pokemon[0].item_ident = 'iron-ball';
      initialBattleCopy.battle_state.red_side_pokemon[0].item_ident = 'leftovers';
      const earthquakeActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, earthquakeAction);
      expect(earthquakeActionDamage.damage).toEqual(124);
    });

  });

  describe("LIFE_ORB", () => {
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [quaquavalBuild],
      redSidePokemonBuilds: [meowscaradaBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const uTurnAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
      "u-turn",
      ["blue-field-1"]
    );

    test("it multiplies damage correctly", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.red_side_pokemon[0].item_ident = 'life-orb';
      const uTurnActionDamage = await CALCULATE_DAMAGE(initialBattleCopy, uTurnAction);
      expect(uTurnActionDamage.damage).toEqual(27);
    });

  });

});
