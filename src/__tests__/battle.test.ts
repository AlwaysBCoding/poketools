import {
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
      initialBattle.battle_state.blue_side_pokemon[0],
      "nasty-plot",
      ["blue-field-1"]
    );

    const reflectAction: BattleAction = composeMoveAction(
      initialBattle.battle_state.red_side_pokemon[0],
      "reflect",
      ["red-field-1"]
    );

    const battleStepResult = await BATTLE_STEP(initialBattle, [nastyPlotAction], [reflectAction]);
    expect(battleStepResult.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_attack).toEqual(2);

    const switchAction: BattleAction = composeSwitchAction(
      battleStepResult.battle.battle_state.blue_side_pokemon[0],
      battleStepResult.battle.battle_state.blue_side_pokemon[1]
    );

    const lightScreenAction: BattleAction = composeMoveAction(
      battleStepResult.battle.battle_state.red_side_pokemon[0],
      "light-screen",
      ["red-field-1"]
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

});
