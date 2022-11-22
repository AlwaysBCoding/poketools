import {
  MEOWSCARADA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./__factories__/pokemon.factory";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";
import { BattleState } from "../models/battle/BattleState";
import { createNewBattleState1v1 } from "./__factories__/battle.factory";
import { orderActions } from "../models/battle/order-actions";
import { BattleAction, BattleActionSwitch } from "../models/battle/BattleAction";

describe("GAME LOOP", () => {
  var meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
  var quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);

  describe("ORDER ACTIONS", () => {

    it("can order actions based on static speeds", () => {
      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {location: "field"}),
        Object.assign(quaquavalBuild, {location: "field"})
      );

      const redAction: BattleAction = {
        actor_side: "red",
        action_type: "move",
        actor_pokemon: battleState.red_side_pokemon[0],
        move_ident: "aqua-step",
        move_target: "enemy"
      };

      const blueAction: BattleAction = {
        actor_side: "blue",
        action_type: "move",
        actor_pokemon: battleState.blue_side_pokemon[0],
        move_ident: "energy-ball",
        move_target: "enemy"
      };

      const turnActions = [redAction, blueAction];
      const orderedActions = orderActions(battleState, turnActions);

      expect(orderedActions).toEqual([blueAction, redAction]);

    });

    it("can order actions based on boosted speeds", () => {

      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {location: "field"}),
        Object.assign(quaquavalBuild, {location: "field"})
      );

      battleState.red_side_pokemon[0].stat_boosts.speed = 1;

      const redAction: BattleAction = {
        actor_side: "red",
        action_type: "move",
        actor_pokemon: battleState.red_side_pokemon[0],
        move_ident: "aqua-step",
        move_target: "enemy"
      };

      const blueAction: BattleAction = {
        actor_side: "blue",
        action_type: "move",
        actor_pokemon: battleState.blue_side_pokemon[0],
        move_ident: "energy-ball",
        move_target: "enemy"
      };

      const turnActions = [redAction, blueAction];
      const orderedActions = orderActions(battleState, turnActions);

      expect(orderedActions).toEqual([redAction, blueAction]);

    });

    it("can take tailwind into account", () => {

      var battleState: BattleState = createNewBattleState1v1(
        Object.assign(meowscaradaBuild, {location: "field"}),
        Object.assign(quaquavalBuild, {location: "field"})
      );

      battleState.red_side_pokemon[0].stat_boosts.speed = 2;
      battleState.blue_side_state.tailwind = true;

      const redAction: BattleAction = {
        actor_side: "red",
        action_type: "move",
        actor_pokemon: battleState.red_side_pokemon[0],
        move_ident: "aqua-step",
        move_target: "enemy"
      };

      const blueAction: BattleAction = {
        actor_side: "blue",
        action_type: "move",
        actor_pokemon: battleState.blue_side_pokemon[0],
        move_ident: "energy-ball",
        move_target: "enemy"
      };

      const turnActions = [redAction, blueAction];
      const orderedActions = orderActions(battleState, turnActions);

      expect(orderedActions).toEqual([blueAction, redAction]);

    });

  });

});
