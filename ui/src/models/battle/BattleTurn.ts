import { BattleAction } from "./BattleAction";
import { BattleEvent } from "./BattleEvent";

export interface BattleTurn {
  turn_index: number;
  actions: BattleAction[];
  events: BattleEvent[];
}
