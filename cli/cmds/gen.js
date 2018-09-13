const fs = require('fs');
const path = require('path');
var plist = require('plist');

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
  // prep config file

  const count = args._.length;
  const srcPath = (count > 1)? args._[1] : './pinset.json';
  if (!fs.existsSync(srcPath)) {
    Log.fatal(`Missing config file: ${srcPath}`);
  }

  // prep android project path

  let andBase = "./android";
  if (args.a) {
    if (args.a.length <= 0) {
      Log.fatal(`Option '-a' missing path to Android project`);
    }
    andBase = args.a;
  }
  const andExists = fs.existsSync(andBase);
  if (!andExists) {
    Log.warn(`Android project not found: ${andBase}`);
  }

  const andPath = `${andBase}/app/src/main/java/com/criticalblue/reactnative/GeneratedCertificatePinner.java`;

  // prep ios project path
  
  let iosBase = "./ios";
  if (args.i) {
    if (args.i.length <= 0) {
      Log.fatal(`Option '-i' missing path to iOS project`);
    }
    iosBase = args.i;
  }
  const iosExists = fs.existsSync(iosBase);
  if (!iosExists) {
    Log.warn(`iOS project not found: ${iosBase}`);
  }

  let iosPath = '';
  let iosInfo = {};
  if (iosExists) {
    const iosXcodeprojs = fs.readdirSync(iosBase).filter(fn => fn.endsWith('.xcodeproj'));
    if (iosXcodeprojs.length != 1) {
      Log.fatal('Cannot find unique *.xcodeproj in ${iosBase)');
    }
    iosPath = iosBase + '/' + path.basename(iosXcodeprojs[0], '.xcodeproj') + '/info.plist';
    if (!fs.existsSync(iosPath)) {
      Log.fatal(`Missing iOS plist file: ${iosPath}`);
    }

    iosInfo = plist.parse(fs.readFileSync(iosPath, 'utf8'));
  }

  // check any projects

  if (!andExists && !iosExists) {
    Log.fatal('Neither Android nor iOS projects found');
  }

  // check file ages

  let andUpdate = andExists;
  if (andUpdate && fs.existsSync(andPath)) {
    if (fs.statSync(srcPath).mtimeMs < fs.statSync(andPath).mtimeMs) {
      if (!args.f) {
        andUpdate = false;
        Log.warn(`config file'${srcPath}' is older than Android file '${andPath}'; use '-f' to force update.`);
      }
    }
  }

  let iosUpdate = iosExists;
  if (iosUpdate && fs.existsSync(iosPath)) {
    if (fs.statSync(srcPath).mtimeMs < fs.statSync(iosPath).mtimeMs) {
      if (!args.f) {
        iosUpdate = false;
        Log.warn(`config file'${srcPath}' is older than iOS file '${iosPath}'; use '-f' to force update.`);
      }
    }
  }

  if (!andUpdate && !iosUpdate) {
    Log.warn('No files updated');
    return;
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

  if (andUpdate) {
    Log.info(`Updating java file '${andPath}'.`);

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

  // write ios config

  if (iosUpdate) {    
    Log.info(`Updating plist file '${iosPath}'.`);

    try {
      let iosDomains = {};
      for (let domain in pinset.domains) {
        let includeSubdomains = false;
        let baseDomain = domain;
        if (domain.startsWith('*.')) {
          includeSubdomains = true;
          baseDomain = domain.substring(2);
        }
        let iosDomain = { 
          TSKEnforcePinning: true,
          TSKIncludeSubdomains: includeSubdomains,
          TSKPublicKeyAlgorithms: ['TSKAlgorithmRsa2048'],
        };
        pinArray = [];
        pinset.domains[domain].pins.forEach((pin) => {
          if (pin.startsWith('sha256/')) {
            pinArray.push(pin.substring(7));
          } else {
            pinArray.push(pin);
          }
        });
        iosDomain['TSKPublicKeyHashes'] = pinArray;
        iosDomains[baseDomain] = iosDomain;
      }
      iosInfo['TSKConfiguration'] = {
        'TSKPinnedDomains': iosDomains,
        'TSKSwizzleNetworkDelegates': true
      }

      // WRITE OUT FILE HERE
      fs.writeFileSync(iosPath, plist.build(iosInfo));
    } catch(err) {
      Log.fatal(`iOS plist file '${iosPath}' error: ${err}`);
    }
  }
}
