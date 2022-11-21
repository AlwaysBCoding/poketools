import { BattleState } from "../../models/battle/BattleState";
import {
  MEOWSCARDA_MAX_STATS,
  QUAQUAVAL_MAX_STATS
} from "./pokemon.factory";

export const createNewBattle = () => {

  const newBattleState: BattleState = {
    global_state: {
      terrain: "none",
      weather: "none",
      auras: []
    },
    blue_side_state: {
      reflect: false,
      light_screen: false,
      aurora_veil: false,
      tailwind: false
    },
    red_side_state: {
      reflect: false,
      light_screen: false,
      aurora_veil: false,
      tailwind: false
    }
  };

  const attackingPokemon = MEOWSCARDA_MAX_STATS;
  const defendingPokemon = QUAQUAVAL_MAX_STATS;

};
