import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild"
import { PokemonBuildTemplate } from "../models/pokemon/PokemonBuildTemplate";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonItemIdent, PokemonAbilityIdent, PokemonTypeIdent, PokemonNatureIdent, PokemonMoveIdent } from "../models/pokemon/PokemonShared";

import { smogonIdentReverseMapping } from "../decorators/Pokemon";

import vgcUsageData from "../data/stats/2022-12-vgc-series1-usage.json";

const parsePokepasteText = (pokepasteText: string): PokemonBuildTemplate[] | null => {
  try {
    const team = [];
    const monsText = pokepasteText.split(/^\n/gm);

    for (const monText of monsText) {
      const pokemonBuildTemplate: any = {};
      const monData = monText.trim().split(/\n/);
      const monMetaText = monData[0];
      const pokemonIdentText = monMetaText.split("@")[0];
      const pokemonItemText = monMetaText.split("@")[1];

      const pokemonIdentItems = pokemonIdentText.split("(");
      if(pokemonIdentItems.length === 3) {
        pokemonBuildTemplate["pokemon_ident"] = smogonIdentReverseMapping(pokemonIdentItems[1].trim().replace(")", "").toLowerCase().split(/\s/).join("-"));
        pokemonBuildTemplate["nickname"] = pokemonIdentItems[0].trim();
        const pokemonGenderData = pokemonIdentItems[2].trim().replace(")", "");
        if(pokemonGenderData === "F") {
          pokemonBuildTemplate["gender"] = "female";
        }
        if(pokemonGenderData === "M") {
          pokemonBuildTemplate["gender"] = "male";
        }
      } else if(pokemonIdentItems.length === 2) {
        if(pokemonIdentItems[1].trim() === "M)" || pokemonIdentItems[1].trim() === "F)") {
          pokemonBuildTemplate["pokemon_ident"] = smogonIdentReverseMapping(pokemonIdentItems[0].trim().toLowerCase().split(/\s/).join("-"));
          pokemonBuildTemplate["nickname"] = null;
          const pokemonGenderData = pokemonIdentItems[1].trim().replace(")", "");
          if(pokemonGenderData === "F") {
            pokemonBuildTemplate["gender"] = "female";
          }
          if(pokemonGenderData === "M") {
            pokemonBuildTemplate["gender"] = "male";
          }
        } else {
          pokemonBuildTemplate["nickname"] = pokemonIdentItems[0].trim();
          pokemonBuildTemplate["pokemon_ident"] = smogonIdentReverseMapping(pokemonIdentItems[1].trim().toLowerCase().split(/\s/).join("-"));
        }
      } else if(pokemonIdentItems.length === 1) {
        pokemonBuildTemplate["pokemon_ident"] = smogonIdentReverseMapping(pokemonIdentItems[0].trim().toLowerCase().split(/\s/).join("-"));
        pokemonBuildTemplate["nickname"] = null;
        pokemonBuildTemplate["gender"] = null;
      }

      pokemonBuildTemplate["shiny"] = false;

      if(pokemonItemText) {
        pokemonBuildTemplate["item_ident"] = pokemonItemText.trim().toLowerCase().split(/\s/).join("-") as PokemonItemIdent;
      }

      if(monData.find((r) => { return r.startsWith("Level:") })) {
        pokemonBuildTemplate["level"] = Number(monData.find((r) => { return r.startsWith("Level:") })?.split(":")[1].trim());
      } else {
        pokemonBuildTemplate["level"] = 50;
      }

      if(monData.find((r) => { return r.startsWith("Ability:") })) {
        pokemonBuildTemplate["ability_ident"] = monData.find((r) => { return r.startsWith("Ability:") })?.split(":")[1].trim().toLowerCase().split(/\s/).join("-") as PokemonAbilityIdent;
      }

      if(monData.find((r) => { return r.startsWith("Tera Type:") })) {
        pokemonBuildTemplate["tera_type_ident"] = monData.find((r) => { return r.startsWith("Tera Type:") })?.split(":")[1].trim().toLowerCase() as PokemonTypeIdent;
      }

      if(monData.find((r) => { return r.includes("Nature") })) {
        pokemonBuildTemplate["nature_ident"] = monData.find((r) => { return r.includes("Nature") })?.split(/\s/)[0].trim().toLowerCase() as PokemonNatureIdent;
      }

      pokemonBuildTemplate["move_idents"] = monData.filter((r) => { return r.startsWith("-") }).map((s) => {
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

      pokemonBuildTemplate["iv_spread"] = ivSpread;

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
      } else {
        const pokemonUsageData = vgcUsageData.find((usageData: any) => {
          return smogonIdentReverseMapping(usageData.ident) == pokemonBuildTemplate["pokemon_ident"];
        });
        if(pokemonUsageData) {
          const mostCommonSpread = pokemonUsageData.spreads[0];
          const mostCommonSpreadNature = mostCommonSpread[0] as string;
          const mostCommonSpreadEVs = mostCommonSpread[1] as number[];
          evSpread["hp"] = mostCommonSpreadEVs[0];
          evSpread["attack"] = mostCommonSpreadEVs[1];
          evSpread["special_attack"] = mostCommonSpreadEVs[2];
          evSpread["defense"] = mostCommonSpreadEVs[3];
          evSpread["special_defense"] = mostCommonSpreadEVs[4];
          evSpread["speed"] = mostCommonSpreadEVs[5];
          if(!pokemonBuildTemplate["nature_ident"]) { pokemonBuildTemplate["nature_ident"] = mostCommonSpreadNature; }
        }
      }

      pokemonBuildTemplate["ev_spread"] = evSpread;

      team.push(pokemonBuildTemplate as PokemonBuildTemplate);
    }
    return team;
  } catch (error) {
    return null;
  }
}

export const ImportTeamScreen = () => {
  const [importData, setImportData] = useState<string>("");

  const importTeam = () => {
    try {
      const pokemonBuildTemplates = parsePokepasteText(importData);
      if(pokemonBuildTemplates) {
        const pokemonBuilds: PokemonBuild[] = pokemonBuildTemplates.map((pbt: PokemonBuildTemplate) => { return pokemonBuildTemplateToPokemonBuild(pbt) })
        const timestamp = Date.now();
        const team: PokemonTeam = {
          uuid: uuidv4(),
          team_name: `Imported Team: ${timestamp}`,
          created_at: timestamp,
          pokemonBuilds
        }
        let nextSavedTeams: Record<string, PokemonTeam> = {};
        const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
        nextSavedTeams[team.uuid] = team;
        if(!savedTeams) {
          nextSavedTeams[team.uuid] = team;
        } else {
          nextSavedTeams = savedTeams;
          nextSavedTeams[team.uuid] = team;
        }
        localStorage.setItem("savedTeams", JSON.stringify(nextSavedTeams));
        alert("team imported");
      } else {
        alert("error importing team");
      }
    } catch (error) {
      alert("error importing team");
    }
  }

  return (
    <div className="screen import-team-screen">
      <h1>Import Team</h1>
      <div className="import-section">
        <textarea
          placeholder="ENTER POKEPASTE DATA"
          value={importData}
          onChange={(e) => { setImportData(e.target.value); }} />
      </div>
      <div className="button import-action" onClick={importTeam}>
        Import!
      </div>
    </div>
  )
}
