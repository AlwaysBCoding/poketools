import { BattleState } from "../models/battle/BattleState";
import { createNewBattle } from "./__factories__/battle.factory";
import { calculateDamage } from "../models/battle/damage-calc";

describe("DAMAGE_CALC", () => {

  test("it runs the test", () => {
    const battleState: BattleState = createNewBattle();
    const result = calculateDamage(
      battleState,
      battleState.blue_side_pokemon[0],
      battleState.red_side_pokemon[0],
      "u-turn"
    );
    expect([21, 22, 23, 24, 25]).toContain(result);
  });

});
