import { MEOWSCARADA_MAX_STATS } from "./__factories__/pokemon.factory";
import { calculateStats } from "../models/pokemon/stat-calc";

describe("STAT_CALC", () => {

  it("calculates the stat spread given input values", () => {
    const result = calculateStats(MEOWSCARADA_MAX_STATS);
    expect(result).toEqual({
      hp: 151,
      attack: 162,
      defense: 90,
      special_attack: 90,
      special_defense: 91,
      speed: 192
    });
  });

});
