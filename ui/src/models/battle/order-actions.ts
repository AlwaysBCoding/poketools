export {}
// import { BattleState } from "./BattleState";
// import { BattleAction } from "./BattleAction";

// const STAT_BOOST_MODIFIER_VALUES: Record<string, number> = {
//   "-6": 0.25,
//   "-5": 0.285,
//   "-4": 0.333,
//   "-3": 0.4,
//   "-2": 0.5,
//   "-1": 0.666,
//   "0": 1,
//   "1": 1.5,
//   "2": 2,
//   "3": 2.5,
//   "4": 4,
//   "5": 3.5,
//   "6": 4
// }

// const compareWithBattleState = (battleState: BattleState) => {

//   return function(a: BattleAction, b: BattleAction) {
//     const aBaseSpeed = a.actor.pokemon_build.stat_spread.speed;
//     const bBaseSpeed = b.actor.pokemon_build.stat_spread.speed;

//     var aSpeed: number = aBaseSpeed * STAT_BOOST_MODIFIER_VALUES[`${a.actor.stat_boosts.speed}`];
//     var bSpeed: number = bBaseSpeed * STAT_BOOST_MODIFIER_VALUES[`${b.actor.stat_boosts.speed}`];

//     if((a.actor.battle_side === "red" && battleState.red_side_state.tailwind) || a.actor.battle_side === "blue" && battleState.blue_side_state.tailwind) {
//       aSpeed = aSpeed * 2;
//     }
//     if((b.actor.battle_side === "red" && battleState.red_side_state.tailwind) || b.actor.battle_side === "blue" && battleState.blue_side_state.tailwind) {
//       bSpeed = bSpeed * 2;
//     }

//     if(aSpeed > bSpeed) { return -1; }
//     if(bSpeed > aSpeed) { return 1; }

//     if(aSpeed === bSpeed) {
//       const speedTiebreakValue = Math.random();
//       if(speedTiebreakValue > 0.5) {
//         return -1;
//       } else {
//         return 1;
//       }
//     }

//     return 0;
//   }

// }

// export const orderActions = ((battleState: BattleState, battleActions: BattleAction[]): BattleAction[] => {
//   return battleActions.sort(compareWithBattleState(battleState));
// });
