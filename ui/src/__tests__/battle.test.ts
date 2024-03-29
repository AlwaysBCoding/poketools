import {
  TALONFLAME_ATEAM_BUILD,
  ANNIHILAPE_BULKY_BUILD,
  GHOLDENGO_ATEAM_BUILD,
  MEOWSCARADA_MAX_STATS,
  GRIMMSNARL_ATEAM_BUILD,
  QUAQUAVAL_MAX_STATS
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";
import { BattleConfig } from "../models/battle/BattleShared";
import { BattleAction, composeMoveAction, composeSwitchAction } from "../models/battle/BattleAction";
import { Battle, createBattle, initialStep } from "../models/battle/Battle";

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
      hardcoded_stat_change_frequency_roll: hardcodedStatChangeFrequencyRoll
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

describe("GAME LOOP", () => {

  test("it resets a pokemon's stat boosts when it switches out", async () => {
    GHOLDENGO_ATEAM_BUILD.move_idents = ["shadow-ball", "thunderbolt", "make-it-rain", "nasty-plot"];
    let gholdengoBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GHOLDENGO_ATEAM_BUILD);
    let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
    let grimmsnarlBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(GRIMMSNARL_ATEAM_BUILD);
    let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [gholdengoBuild, meowscaradaBuild],
      redSidePokemonBuilds: [grimmsnarlBuild, quaquavalBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const nastyPlotAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "nasty-plot",
      ["blue-field-1"]
    );

    const reflectAction: BattleAction = composeMoveAction(
      "red-field-1",
      "reflect",
      ["red-field-1", "red-field-2"]
    );

    const battleStepResult = await BATTLE_STEP(initialBattle, [nastyPlotAction], [reflectAction]);
    expect(battleStepResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_attack).toEqual(2);

    const switchAction: BattleAction = composeSwitchAction(
      "blue-field-1",
      battleStepResult.battle.battle_state.blue_side_pokemon[1].battle_id
    );

    const lightScreenAction: BattleAction = composeMoveAction(
      "red-field-1",
      "light-screen",
      ["red-field-1", "red-field-2"]
    );

    const battleStepResult2 = await BATTLE_STEP(battleStepResult.battle, [switchAction], [lightScreenAction]);
    expect(battleStepResult2.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_attack).toEqual(0);
  });

  test("a pokemon cannot get to a stat boost stage of greater than 6", async () => {
    // TODO: IMPLEMENT
  });

  test("a pokemon cannot get to a stat boost stage of less than 6", async () => {
    // TODO: IMPLEMENT
  });

  test("a pokemon cannot act after fainting", async () => {
    let talonflameBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(TALONFLAME_ATEAM_BUILD);
    talonflameBuild.move_idents = ["acrobatics", "brave-bird", "flare-blitz", "feint"];
    talonflameBuild.item_ident = null;
    let annihilapeBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(ANNIHILAPE_BULKY_BUILD);

    let createdBattle: Battle = createBattle({
      config: BATTLE_CONFIG,
      blueSidePokemonBuilds: [talonflameBuild],
      redSidePokemonBuilds: [annihilapeBuild]
    });
    let initialBattle: Battle = initialStep(createdBattle);

    const braveBirdAction: BattleAction = composeMoveAction(
      "blue-field-1",
      "acrobatics",
      ["red-field-1"]
    )

    const drainPunchAction: BattleAction = composeMoveAction(
      "red-field-1",
      "drain-punch",
      ["blue-field-1"]
    );

    const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
    initialBattleCopy.battle_state.red_side_pokemon[0].current_hp = 100;
    const battleStepResult = await BATTLE_STEP(initialBattleCopy, [braveBirdAction], [drainPunchAction]);
    expect(battleStepResult.battle.battle_state.blue_side_pokemon[0].current_hp).toEqual(154);
  });

});

describe("WEATHER", () => {

  describe("RAIN", () => {
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

    const aquaStepAction: BattleAction = composeMoveAction(
      "red-field-1",
      "aqua-step",
      ["blue-field-1"]
    );

    test("it reduces the damage of fire attacks", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.global_state.weather = "rain";
      const flareBlitzDamageResult = await CALCULATE_DAMAGE(initialBattleCopy, flareBlitzAction);
      expect(flareBlitzDamageResult.damage).toEqual(24);
    });

    test("it multiplies the damage of water attacks", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.global_state.weather = "rain";
      initialBattleCopy.battle_state.red_side_pokemon[0].stat_boosts.attack = -2;
      const aquaStepDamageResult = await CALCULATE_DAMAGE(initialBattleCopy, aquaStepAction);
      expect(aquaStepDamageResult.damage).toEqual(132);
    });
  });

  describe("SANDSTORM", () => {

  });

  describe("SNOW", () => {

  });

  describe("SUN", () => {
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

    const aquaStepAction: BattleAction = composeMoveAction(
      "red-field-1",
      "aqua-step",
      ["blue-field-1"]
    );

    test("it multiplies the damage of fire attacks", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.global_state.weather = "sun";
      const flareBlitzDamageResult = await CALCULATE_DAMAGE(initialBattleCopy, flareBlitzAction);
      expect(flareBlitzDamageResult.damage).toEqual(75);
    });

    test("it reduces the damage of water attacks", async () => {
      const initialBattleCopy = JSON.parse(JSON.stringify(initialBattle));
      initialBattleCopy.battle_state.global_state.weather = "sun";
      const aquaStepDamageResult = await CALCULATE_DAMAGE(initialBattleCopy, aquaStepAction);
      expect(aquaStepDamageResult.damage).toEqual(84);
    });
  });

})

describe("TERRAINS", () => {

  describe("ELECTRIC TERRAIN", () => {
    // TODO: IMPLEMENT
  });

  describe("GRASSY TERRAIN", () => {
    // TODO: IMPLEMENT
  });

  describe("MISTY TERRAIN", () => {
    // TODO: IMPLEMENT
  });

  describe("PSYCHIC TERRAIN", () => {
    // TODO: IMPLEMENT
  });

});
