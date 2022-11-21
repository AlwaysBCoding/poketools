import { PokemonMove } from "../PokemonMove";
import { BattleState } from "./BattleState";
import { PokemonBattleState } from "./PokemonBattleState";

export const calculateDamage = ((
  battleState: BattleState,
  attackingPokemon: PokemonBattleState,
  targetPokemon: PokemonBattleState,
  moveIdent: PokemonMove
): number[] => {

  const level = 50;
  const power = 90;
  const aValue = 66;
  const dValue = 106;
  const targets = 1;
  const weather = 1;
  const critical = 1;
  const randomRolls = [0.85, 0.86, 0.87, 0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00];
  const stab = 1.5;
  const type = 2;
  const burn = 1;
  const other = 1;

  const damageRolls = randomRolls.map((randomRoll) => {
    const baseDamage = (Math.floor(Math.floor(Math.floor(((2 * level) / 5) + 2) * power * (aValue / dValue)) / 50) + 2);
    return Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(baseDamage * targets) * weather) * critical) * randomRoll) * stab) * type) * burn) * other);
  });

  return damageRolls;

});
