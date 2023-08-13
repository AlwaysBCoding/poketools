import { PokemonItemIdent, PokemonAbilityIdent, PokemonTypeIdent, PokemonNatureIdent, PokemonMoveIdent } from './models/pokemon/PokemonShared';
import { Pokemon } from './models/pokemon/Pokemon';
import { PokemonTeam } from './models/pokemon/PokemonTeam';
import { PokemonBuild } from './models/pokemon/PokemonBuild';
import { smogonIdentReverseMapping } from './decorators';
import { calculateStatSpread } from './stat-calc';
import allPokemon from './data/all-pokemon.json';

export const importTeam = (pokepasteText: string, uuid: string): PokemonTeam | null => {
  try {
    const pokemonBuilds: PokemonBuild[] = [];

    const monsText = pokepasteText.split(/^\n/gm);

    for (const monText of monsText) {
      const pokemonBuild: any = {};
      const monData = monText.trim().split(/\n/);
      const monMetaText = monData[0];
      const pokemonIdentText = monMetaText.split("@")[0];
      const pokemonItemText = monMetaText.split("@")[1];

      const pokemonIdentItems = pokemonIdentText.split("(");
      if(pokemonIdentItems.length === 3) {
        pokemonBuild['pokemon_ident'] = smogonIdentReverseMapping(pokemonIdentItems[1].trim().replace(")", "").toLowerCase().split(/\s/).join("-"));
        pokemonBuild['nickname'] = pokemonIdentItems[0].trim();
        const pokemonGenderData = pokemonIdentItems[2].trim().replace(")", "");
        if(pokemonGenderData === "F") {
          pokemonBuild['gender'] = "female";
        }
        if(pokemonGenderData === "M") {
          pokemonBuild['gender'] = "male";
        }
      } else if(pokemonIdentItems.length === 2) {
        if(pokemonIdentItems[1].trim() === "M)" || pokemonIdentItems[1].trim() === "F)") {
          pokemonBuild['pokemon_ident'] = smogonIdentReverseMapping(pokemonIdentItems[0].trim().toLowerCase().split(/\s/).join("-"));
          pokemonBuild['nickname'] = null;
          const pokemonGenderData = pokemonIdentItems[1].trim().replace(")", "");
          if(pokemonGenderData === "F") {
            pokemonBuild['gender'] = "female";
          }
          if(pokemonGenderData === "M") {
            pokemonBuild['gender'] = "male";
          }
        } else {
          pokemonBuild['nickname'] = pokemonIdentItems[0].trim();
          pokemonBuild['pokemon_ident'] = smogonIdentReverseMapping(pokemonIdentItems[1].trim().toLowerCase().split(/\s/).join("-"));
        }
      } else if(pokemonIdentItems.length === 1) {
        pokemonBuild['pokemon_ident'] = smogonIdentReverseMapping(pokemonIdentItems[0].trim().toLowerCase().split(/\s/).join("-"));
        pokemonBuild['nickname'] = null;
        pokemonBuild['gender'] = null;
      }

      pokemonBuild['shiny'] = false;

      if(pokemonItemText) {
        pokemonBuild['item_ident'] = pokemonItemText.trim().toLowerCase().split(/\s/).join("-") as PokemonItemIdent;
      }

      if(monData.find((r) => { return r.startsWith("Level:") })) {
        pokemonBuild['level'] = Number(monData.find((r) => { return r.startsWith("Level:") })?.split(":")[1].trim());
      } else {
        pokemonBuild['level'] = 50;
      }

      if(monData.find((r) => { return r.startsWith("Ability:") })) {
        pokemonBuild['ability_ident'] = monData.find((r) => { return r.startsWith("Ability:") })?.split(":")[1].trim().toLowerCase().split(/\s/).join("-") as PokemonAbilityIdent;
      }

      if(monData.find((r) => { return r.startsWith("Tera Type:") })) {
        pokemonBuild['tera_type_ident'] = monData.find((r) => { return r.startsWith("Tera Type:") })?.split(":")[1].trim().toLowerCase() as PokemonTypeIdent;
      }

      if(monData.find((r) => { return r.includes("Nature") })) {
        pokemonBuild['nature_ident'] = monData.find((r) => { return r.includes("Nature") })?.split(/\s/)[0].trim().toLowerCase() as PokemonNatureIdent;
      }

      pokemonBuild['move_idents'] = monData.filter((r) => { return r.startsWith("-") }).map((s) => {
        return s.slice(1).trim().toLowerCase().split(/\s/).join("-") as PokemonMoveIdent;
      });

      let ivSpread = {
        "hp": 31,
        "attack": 31,
        "defense": 31,
        "special_attack": 31,
        "special_defense": 31,
        "speed": 31
      }

      if(monData.find((r) => { return r.startsWith("IVs:") })) {
        const ivs = monData.find((r) => { return r.startsWith("IVs:") })?.split(":")[1].split("/").map((s) => { return s.trim() }).map((s) => { return s.split(/\s/) });
        if(ivs?.find((r) => { return r[1] === "HP" })) {
          ivSpread["hp"] = Number(ivs?.find((r) => { return r[1] === "HP" })![0]);
        }
        if(ivs?.find((r) => { return r[1] === "Atk" })) {
          ivSpread["attack"] = Number(ivs?.find((r) => { return r[1] === "Atk" })![0]);
        }
        if(ivs?.find((r) => { return r[1] === "Def" })) {
          ivSpread["defense"] = Number(ivs?.find((r) => { return r[1] === "Def" })![0]);
        }
        if(ivs?.find((r) => { return r[1] === "SpA" })) {
          ivSpread["special_attack"] = Number(ivs?.find((r) => { return r[1] === "SpA" })![0]);
        }
        if(ivs?.find((r) => { return r[1] === "SpD" })) {
          ivSpread["special_defense"] = Number(ivs?.find((r) => { return r[1] === "SpD" })![0]);
        }
        if(ivs?.find((r) => { return r[1] === "Spe" })) {
          ivSpread["speed"] = Number(ivs?.find((r) => { return r[1] === "Spe" })![0]);
        }
      }

      pokemonBuild['iv_spread'] = ivSpread;

      let evSpread = {
        "hp": 0,
        "attack": 0,
        "defense": 0,
        "special_attack": 0,
        "special_defense": 0,
        "speed": 0
      }

      if(monData.find((r) => { return r.startsWith("EVs:") })) {
        const evs = monData.find((r) => { return r.startsWith("EVs:") })?.split(":")[1].split("/").map((s) => { return s.trim() }).map((s) => { return s.split(/\s/) });
        if(evs?.find((r) => { return r[1] === "HP" })) {
          evSpread["hp"] = Number(evs?.find((r) => { return r[1] === "HP" })![0]);
        }
        if(evs?.find((r) => { return r[1] === "Atk" })) {
          evSpread["attack"] = Number(evs?.find((r) => { return r[1] === "Atk" })![0]);
        }
        if(evs?.find((r) => { return r[1] === "Def" })) {
          evSpread["defense"] = Number(evs?.find((r) => { return r[1] === "Def" })![0]);
        }
        if(evs?.find((r) => { return r[1] === "SpA" })) {
          evSpread["special_attack"] = Number(evs?.find((r) => { return r[1] === "SpA" })![0]);
        }
        if(evs?.find((r) => { return r[1] === "SpD" })) {
          evSpread["special_defense"] = Number(evs?.find((r) => { return r[1] === "SpD" })![0]);
        }
        if(evs?.find((r) => { return r[1] === "Spe" })) {
          evSpread["speed"] = Number(evs?.find((r) => { return r[1] === "Spe" })![0]);
        }
      }

      pokemonBuild['ev_spread'] = evSpread;

      // ---

      const statSpread = calculateStatSpread(
        pokemonBuild.pokemon_ident,
        pokemonBuild.iv_spread,
        pokemonBuild.ev_spread,
        pokemonBuild.nature_ident,
        pokemonBuild.level
      );

      const pokemonData: Pokemon = (allPokemon.find((pokemon: any) => {
        return pokemon.ident === pokemonBuild.pokemon_ident;
      }) as Pokemon);

      pokemonBuild['pokemon'] = pokemonData;
      pokemonBuild['stat_spread'] = statSpread;

      pokemonBuilds.push(pokemonBuild)
    }

    const timestamp = Date.now();
    const team: PokemonTeam = {
      uuid: uuid,
      team_name: `Imported Team: ${timestamp}`,
      created_at: timestamp,
      pokemonBuilds: pokemonBuilds
    }

    return team;

  } catch (error) {
    console.log(`GOT ERROR PARSING TEAM`);
    console.log(error);
    return null;
  }
}
