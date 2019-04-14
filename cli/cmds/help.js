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

      --android, -a <path> ................... Android project folder (defaults to './android')
      --ios, -i <path> ....................... iOS projects folder (defaults to './ios')
      --project, -p <xcodeproj name> | all ... update specific iOS project(s). It can be used multiple times
      --force, -f ............................ always overwrite existing configuration
    
      config ................................. configuration file - defaults to 'pinset.json'

      Examples:
      --------------------------------------------
      Custom paths
        pinset gen -a my-app/android -i my-app/ios
      
      Multiple iOS projects in same folder
        Updates only myapp
          pinset gen -p myapp.xcodeproj
        
        Updates myapp and myStagingApp
          pinset gen -p myapp -p myStagingApp

        Updates all xcode projects in folder
          pinset gen -p all
    `

  // lookup: `
  //   pinset lookup <url>

  //     url ................... url (include 'https://')`
};

module.exports = (args) => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  Log.info(menus[subCmd] || menus.main);
};
