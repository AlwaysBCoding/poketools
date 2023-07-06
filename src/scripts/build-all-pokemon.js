var fs = require('fs');
var path = require('path');

var recursive_file_path_search = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          recursive_file_path_search(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const FILE_FILTER_REGEX = new RegExp(/(.*).data.json$/, 'g');
const ALL_POKEMON_DATA = [];
FOLDER_PATHS = ["../data/pokemon/kanto", "../data/pokemon/alola", "../data/pokemon/galar", "../data/pokemon/hisui", "../data/pokemon/paldea"];


FOLDER_PATHS.forEach((folderPath) => {

  recursive_file_path_search(path.resolve(__dirname, folderPath), (error, results) => {
    if (error) { throw error; }

    const allFilePaths = results;
    const filteredFilePaths = allFilePaths.filter((filePath) => { return filePath.match(FILE_FILTER_REGEX) });

    filteredFilePaths.forEach((filePath, index) => {
      const fileData = fs.readFileSync(filePath, {encoding: 'utf-8'});
      const fileJSON = JSON.parse(fileData);

      if(fileJSON.paldea_regional_pokedex_number) {
        fileJSON.pokedex_region = "paldea"
        fileJSON.regional_pokedex_number = fileJSON.paldea_regional_pokedex_number
        delete fileJSON["paldea_regional_pokedex_number"]
      }

      if(fileJSON.formes && fileJSON.formes.length > 0) {
        for (const forme of fileJSON.formes) {
          const formeData = Object.assign({
            national_pokedex_number: fileJSON.national_pokedex_number,
            pokedex_region: fileJSON.pokedex_region,
            regional_pokedex_number: fileJSON.regional_pokedex_number,
            evolution_line_ident: fileJSON.evolution_line_ident,
            evolution_line_index: fileJSON.evolution_line_index
          }, forme);
          ALL_POKEMON_DATA.push(formeData);
        }
      } else {
        ALL_POKEMON_DATA.push(fileJSON);
      }

    });

    fs.writeFileSync(path.resolve(__dirname, "../data/pokemon/all-pokemon.json"), JSON.stringify(ALL_POKEMON_DATA, null, 2));
    
  });

});