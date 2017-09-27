/**
 * Import classes
 */
var fs = require('fs');
var options = require('options-parser');
var readline = require('readline');
var _ = require('lodash');

/**
 * Create stdin
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Parse command line arguments
 */
var opts = options.parse({
  database: { short: 'd', varName: 'FILE', help: 'The database file against which values will be merged.' },
  definition: { short: 'n', varName: 'FILE', help: 'The comparator database file containing the weak entity.' },
  out: { short: 'o', varName: 'FILE', help: 'The output file.' },
  src: { short: 's', varName: 'JSON PATH', help: 'The weak entity to be replaced.' },
  comparator: { short: 'c', varName: 'JSON PATH', help: 'The weak entity within the comparator.' },
  value: { short: 'v', varName: 'JSON PATH', help: 'The value key to be inserted via the weak entity.' },
  help: {
    short: 'h',
    help: 'Command line help.',
    showHelp: { 
      banner: 'JSON Weak Entity Merge: [options]'
    }
  }
});

/**
 * Helper Functions
 */

//read files
var readFile = function(file, pass){
  return new Promise((resolve, reject) => {
    //read file and return json object
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      else if (pass) resolve(pass.concat([JSON.parse(data)]));
      else resolve([JSON.parse(data)]);
      console.log('The file '+file+' has been successfully read.');
    })
  })
}

//merge databases
var mergeDB = function(data, a, b, c){
  return new Promise((resolve, reject) => {
    //iterate through each array in the data array and compare, merge weak entities
    var count = 0;
    
    data[0].forEach((first, i) => {
      data[1].forEach((second, y) => {
        //interpret cmd line arguments
          var comparators = [_.get(data[0][i], a), _.get(data[1][y], b), _.get(data[1][y], c)];
          if (comparators[0] === comparators[1]) {comparators[0] = comparators[2]; count++}
        })
      })
    console.log(count+" weak entities were merged.");
    if (count) resolve(data);
    else reject("No matches found.");
  })
}

//write new file
var writeFile = function(file, data){
  return new Promise((resolve, reject) => {
    //prompt user re writing the file
    rl.question('Save changes? \n\n', (ans) => {
      if (ans !== 'y' || 'Y') reject("Operation refused.");
      else fs.writeFile(file, data, (err, result) => {
        if (err) reject (err);
        else resolve(console.log("Operation was successful."));
      })
      rl.close();
    })
  })
}

/**
 * Main
 */
readFile(opts.opt.database)
  .then(data => readFile(opts.opt.definition, data))
  .then(data => mergeDB(data, opts.opt.src, opts.opt.comparator, opts.opt.value))
  .then(data => writeFile(opts.opt.out, data))
  .catch(err => console.error(err));
