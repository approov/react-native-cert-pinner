const Log = require('../Log');

const menus = {
  main: `
    pinset [command] [options]
  
      init ..... initialize pinset configuration
      gen ...... generate pinset configuration
      version .. show package version
      help ..... show help menu for a command
    `,
  
  init: `
      pinset init [options] [config] 
  
      --force, -f ........... overwrite existing configuration file
      
      config ................ configuration file - defaults to 'pinset.json'
    `,

  gen: `
    pinset gen [options] [config] 

      --android, -a <path> .. path to android project (defaults to './android')
      --force, -f ........... always overwrite existing configuration
    
      config ................ configuration file - defaults to 'pinset.json'
    `,

  // lookup: `
  //   pinset lookup <url>

  //     url ................... url (include 'https://')`
};
  
module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0];
  
  Log.info(menus[subCmd] || menus.main);
}
