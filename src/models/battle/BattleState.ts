import {
  BattleSideState,
  BattleGlobalState,
} from "./BattleShared";

export interface BattleState {
  global_state: BattleGlobalState;
  blue_side_state: BattleSideState;
  red_side_state: BattleSideState;
};
