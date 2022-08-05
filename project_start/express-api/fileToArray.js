let fs = require("fs");

const readFileLines = (filename) => {
  const lines = fs.readFileSync(filename).toString("utf-8").split("\n");
  var positive = [];
  for (let i = 0; i < lines.length; i++) {
    // Checking which words have a positive rating
    var tabs = lines[i].split("\t");
    if (tabs[1] > 0) {
      positive.push(tabs[0]);
    }
  }
  return positive;
};

let arr = readFileLines("./vader_lexicon.txt");

module.exports = arr;
