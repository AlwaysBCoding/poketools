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

recursive_file_path_search(path.resolve(__dirname, "../data/pokemon/paldea"), (error, results) => {
    if (error) { throw error; }

    const allFilePaths = results;
    const filteredFilePaths = allFilePaths.filter((filePath) => { return filePath.match(FILE_FILTER_REGEX) });

    filteredFilePaths.forEach((filePath, index) => {
      const fileData = fs.readFileSync(filePath, {encoding: 'utf-8'});
      const fileJSON = JSON.parse(fileData);
      ALL_POKEMON_DATA.push(fileJSON);
    });

    fs.writeFileSync(path.resolve(__dirname, "../data/pokemon/all-pokemon.json"), JSON.stringify(ALL_POKEMON_DATA, null, 2));

});
