const fs = require('fs');

const Log = require('../Log');

module.exports = (args) => {
  const count = args._.length;
  const path = (count > 1)? args._[1] : './pinset.json';  
  const opts = {
    flag: args.f ? 'w' : 'wx',
    encoding: 'utf-8'
  };
  const initConfig = {
    domains: {
      '*.example.com': {
        pins: [ 
            'sha256/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
         ]
      }
    }
  };
  
  fs.writeFile(path, JSON.stringify(initConfig, null, 2), opts, (err) => {
    if (err) {
      if (!args.f && fs.existsSync(path)) {
        Log.fatal(`File '${path}' already exists; use '-f' to overwrite.`);
      } else {
        Log.fatal(`Error writing to File '${path}'.`);
      }
    } else {
      Log.info(`File '${path}' initialized.`);
    }
  });
};
