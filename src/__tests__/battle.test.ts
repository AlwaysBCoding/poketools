// import {
//   MEOWSCARADA_MAX_STATS,
//   QUAQUAVAL_MAX_STATS
// } from "./__factories__/pokemon.factory";
// import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild";
// import { BattleState } from "../models/battle/BattleState";
// import { createNewBattleState1v1 } from "./__factories__/battle.factory";
// import { orderActions } from "../models/battle/order-actions";
// import { BattleAction, BattleActionSwitch } from "../models/battle/BattleAction";
// import { Battle, createBattle, initialStep } from "../models/battle/Battle";
// import { BattleConfig } from "../models/battle/BattleShared";

// const SERVER_URI = "http://localhost:8000";
// const BATTLE_CONFIG: BattleConfig = {variant: "singles"};

// const ORDER_BATTLE_ACTIONS = async (battle: Battle, battleActions: BattleAction[]): Promise<Record<string, any>> => {
//   const fetchOptions = {
//     method: "POST",
//     headers: {
//       "Accept": "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       battle: battle,
//       battle_actions: battleActions
//     })
//   }

//   const response = await fetch(`${SERVER_URI}/test/order-battle-actions`, fetchOptions);
//   const result = await response.json();
//   return result;
// }

// describe("GAME LOOP", () => {
//   let meowscaradaBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(MEOWSCARADA_MAX_STATS);
//   let quaquavalBuild: PokemonBuild = pokemonBuildTemplateToPokemonBuild(QUAQUAVAL_MAX_STATS);

//   let createdBattle: Battle = createBattle({
//     config: BATTLE_CONFIG,
//     blueSidePokemonBuilds: [meowscaradaBuild],
//     redSidePokemonBuilds: [quaquavalBuild]
//   });
//   let initialBattle: Battle = initialStep(createdBattle);

//   // const acrobaticsAction: BattleAction = composeMoveAction(
//   //   initialBattle.battle_state.blue_side_pokemon[0],
//   //   "acrobatics",
//   //   ["red-field-1"]
//   // );

//   // test("it normal damage if an item is held", async () => {
//   //   const acrobaticsActionCopy = JSON.parse(JSON.stringify(acrobaticsAction));
//   //   acrobaticsActionCopy.actor.item_ident = "leftovers";
//   //   const acrobaticsActionDamageResult = await CALCULATE_DAMAGE(initialBattle, acrobaticsActionCopy);
//   //   expect(acrobaticsActionDamageResult.damage).toEqual(72);
//   // });

//   describe("ORDER ACTIONS", () => {

//     it("can order actions based on static speeds", () => {
//       var battleState: BattleState = createNewBattleState1v1(
//         Object.assign(meowscaradaBuild, {location: "field"}),
//         Object.assign(quaquavalBuild, {location: "field"})
//       );

//       const redAction: BattleAction = {
//         actor_side: "red",
//         action_type: "move",
//         actor_pokemon: battleState.red_side_pokemon[0],
//         move_ident: "aqua-step",
//         move_target: "enemy"
//       };

//       const blueAction: BattleAction = {
//         actor_side: "blue",
//         action_type: "move",
//         actor_pokemon: battleState.blue_side_pokemon[0],
//         move_ident: "energy-ball",
//         move_target: "enemy"
//       };

//       const turnActions = [redAction, blueAction];
//       const orderedActions = orderActions(battleState, turnActions);

//       expect(orderedActions).toEqual([blueAction, redAction]);

//     });

//     it("can order actions based on boosted speeds", () => {

//       var battleState: BattleState = createNewBattleState1v1(
//         Object.assign(meowscaradaBuild, {location: "field"}),
//         Object.assign(quaquavalBuild, {location: "field"})
//       );

//       battleState.red_side_pokemon[0].stat_boosts.speed = 1;

//       const redAction: BattleAction = {
//         actor_side: "red",
//         action_type: "move",
//         actor_pokemon: battleState.red_side_pokemon[0],
//         move_ident: "aqua-step",
//         move_target: "enemy"
//       };

//       const blueAction: BattleAction = {
//         actor_side: "blue",
//         action_type: "move",
//         actor_pokemon: battleState.blue_side_pokemon[0],
//         move_ident: "energy-ball",
//         move_target: "enemy"
//       };

//       const turnActions = [redAction, blueAction];
//       const orderedActions = orderActions(battleState, turnActions);

//       expect(orderedActions).toEqual([redAction, blueAction]);

//     });

//     it("can take tailwind into account", () => {

//       var battleState: BattleState = createNewBattleState1v1(
//         Object.assign(meowscaradaBuild, {location: "field"}),
//         Object.assign(quaquavalBuild, {location: "field"})
//       );

//       battleState.red_side_pokemon[0].stat_boosts.speed = 2;
//       battleState.blue_side_state.tailwind = true;

//       const redAction: BattleAction = {
//         actor_side: "red",
//         action_type: "move",
//         actor_pokemon: battleState.red_side_pokemon[0],
//         move_ident: "aqua-step",
//         move_target: "enemy"
//       };

//       const blueAction: BattleAction = {
//         actor_side: "blue",
//         action_type: "move",
//         actor_pokemon: battleState.blue_side_pokemon[0],
//         move_ident: "energy-ball",
//         move_target: "enemy"
//       };

//       const turnActions = [redAction, blueAction];
//       const orderedActions = orderActions(battleState, turnActions);

//       expect(orderedActions).toEqual([blueAction, redAction]);

//     });

//   });

// });
