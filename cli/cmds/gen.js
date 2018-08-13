const fs = require('fs');

const Log = require('../Log');

const andHead = 
`package com.criticalblue.reactnative;

import okhttp3.CertificatePinner;

public class GeneratedCertificatePinner {
    public static CertificatePinner instance() {
        CertificatePinner.Builder builder = new CertificatePinner.Builder();

`;
const andFoot = 
`
        return builder.build();
    }
}
`;

module.exports = (args) => {
  const count = args._.length;
  const srcPath = (count > 1)? args._[1] : './pinset.json';  
  let andBase = "./android";
  if (args.a) {
    if (args.a.length <= 0) {
      Log.fatal(`Option '-a' missing path to Android project`);
    }
    andBase = args.a;
  }
  const andPath = `${andBase}/app/src/main/java/com/criticalblue/reactnative/GeneratedCertificatePinner.java`;
  const dstOpts = {
    flag: 'wx',
    encoding: 'utf-8'
  };

  // check file ages

  if (fs.existsSync(srcPath) && fs.existsSync(andPath)) {
    if (fs.statSync(srcPath).mtimeMs < fs.statSync(andPath).mtimeMs) {
      if (!args.f) {
        Log.info(`config file'${srcPath}' not modified since Java file '${andPath}' last generated; use '-f' to force overwrite.`);
        return;
      }
    }
  }

  // read pinset config

  let pinset = '';
  try {
    pinset = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  } catch (err) {
    Log.fatal(`Config file '${srcPath}' error: ${err}`);
  }

  Log.info(`Reading config file '${srcPath}'.`);

  // write android config

  Log.info(`Writing java file '${andPath}'.`);

  try {
    let andBody = '';
    for (let domain in pinset.domains) {
      pinset.domains[domain].pins.forEach((pin) => {
        andBody += `        builder.add("${domain}", "${pin}");\n`;
      });
    }
    fs.writeFileSync(andPath, andHead + andBody + andFoot);
  } catch(err) {
    Log.fatal(`Java file '${andPath}' error: ${err}`);
  }
}
