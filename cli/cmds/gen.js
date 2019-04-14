const fs = require('fs');
const path = require('path');
var plist = require('plist');

const Log = require('../Log');

const isValidDomain = (domain) => {
  var pattern = new RegExp(
    /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/
  );
  return pattern.test(domain);
};

const getIOSProjectPath = (baseDir, projectName) =>
  `${baseDir}/${path.basename(projectName, '.xcodeproj')}/info.plist`;

const compareFilesLastModified = (source, destination, isForced) => {
  // No need to check source file is exists or not. It is already checked.
  if (!fs.existsSync(destination)) {
    Log.fatal(`Destination project file is not exists.  (${destination})`);
  }

  if (!isForced && fs.statSync(source).mtimeMs < fs.statSync(destination).mtimeMs) {
    Log.fatal(
      `Config file '${source}' is older than destination file '${destination}'; use '-f' to force update.`
    );
  }

  return true;
};

const updateIOSProject = (iosPath, pinset) => {
  try {
    const iosInfo = plist.parse(fs.readFileSync(iosPath, 'utf8'));
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
        TSKPublicKeyAlgorithms: ['TSKAlgorithmRsa2048']
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
      TSKPinnedDomains: iosDomains,
      TSKSwizzleNetworkDelegates: true
    };

    // WRITE OUT FILE HERE
    fs.writeFileSync(iosPath, plist.build(iosInfo));
    Log.info(`Updated! (${iosPath})`);
  } catch (err) {
    Log.fatal(`iOS plist file '${iosPath}' error: ${err}`);
  }
};

const updateAndroidProject = (andPath, pinset) => {
  try {
    let andBody = '';
    for (let domain in pinset.domains) {
      pinset.domains[domain].pins.forEach((pin) => {
        andBody += `        builder.add("${domain}", "${pin}");\n`;
      });
    }

    const javaFileContent = `package com.criticalblue.reactnative;

import okhttp3.CertificatePinner;

public class GeneratedCertificatePinner {
    public static CertificatePinner instance() {
        CertificatePinner.Builder builder = new CertificatePinner.Builder();
${andBody}
        return builder.build();
    }
}
`;
    fs.writeFileSync(andPath, javaFileContent);
    Log.info(`Updated! (${andPath})`);
  } catch (err) {
    Log.fatal(`Java file '${andPath}' error: ${err}`);
  }
};

module.exports = (args) => {
  // prep config file
  const isForced = !!args.f;
  const count = args._.length;
  const configFile = count > 1 ? args._[1] : './pinset.json';
  if (!fs.existsSync(configFile)) {
    Log.fatal(`Missing config file: ${configFile}`);
  }

  // Read and verify config file
  let pinset = '';
  try {
    pinset = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    if (pinset && !pinset.domains) {
      Log.fatal('Pinset config is not valid. (No domain found!)');
    }
    for (let domain in pinset.domains) {
      let baseDomain = domain.startsWith('*.') ? domain.substring(2) : domain;
      if (!isValidDomain(baseDomain)) {
        Log.fatal(`Invalid domain in config file -> '${baseDomain}'`);
      }

      if (pinset.domains[domain].pins.length === 0) {
        Log.fatal(`There is no hash for domain ${baseDomain}`);
      }
    }
  } catch (err) {
    Log.fatal(`Error on config file '${configFile}'\nError: ${err}`);
  }

  // prep android project path
  if (args.a && args.a.length <= 0) {
    Log.fatal(`Option '-a' missing path to Android project folder`);
  }
  const andBase = args.a || './android';
  const andPath = `${andBase}/app/src/main/java/com/criticalblue/reactnative/GeneratedCertificatePinner.java`;
  if (!fs.existsSync(andBase)) {
    Log.fatal(`Android project not found: ${andBase}`);
  }
  compareFilesLastModified(configFile, andPath, isForced);

  // prep ios project path
  if (args.i && args.i.length <= 0) {
    Log.fatal(`Option '-i' missing path to iOS project folder`);
  }
  const iosBase = args.i || './ios';
  if (!fs.existsSync(iosBase)) {
    Log.fatal(`iOS project folder not found: ${iosBase}`);
  }

  const iosXcodeprojs = fs.readdirSync(iosBase).filter((fn) => fn.endsWith('.xcodeproj'));
  if (iosXcodeprojs.length > 1 && !args.p) {
    const projects = iosXcodeprojs.map((project) => `\t-p ${project}`);
    Log.fatal(`Multiple  *.xcodeproj found in ${iosBase}

      For updating all projects use '-p all'
      Or updating specific one use 
      ${projects.join('\n')}
      
      For more help 'pinset help gen'
      `);
  }

  if (args.p && args.p.length <= 0) {
    Log.fatal(`Option '-p' missing iOS project name or 'all'.\n\n More help 'pinset help gen'`);
  }

  let iosProjectPaths = [];
  // Single ios project in folder
  if (iosXcodeprojs.length == 1) {
    const path = getIOSProjectPath(iosBase, iosXcodeprojs[0]);
    iosProjectPaths.push(path);
  }

  // Specific ios project provided by -p
  if (args.p !== 'all' && !Array.isArray(args.p)) {
    const path = getIOSProjectPath(iosBase, String(args.p).replace('.xcodeproj', ''));
    iosProjectPaths.push(path);
  }

  // Specific ios projects provided by multiple -p
  if (args.p !== 'all' && Array.isArray(args.p)) {
    const paths = args.p.map((project) =>
      getIOSProjectPath(iosBase, String(project).replace('.xcodeproj', ''))
    );
    iosProjectPaths = paths;
  }

  // All ios projects
  if (args.p === 'all') {
    const paths = iosXcodeprojs.map((project) => getIOSProjectPath(iosBase, project));
    iosProjectPaths = paths;
  }

  // Check project file(s) last modify
  iosProjectPaths.forEach((project) => compareFilesLastModified(configFile, project, isForced));

  // write android config
  updateAndroidProject(andPath, pinset);

  // write ios config
  iosProjectPaths.forEach((project) => updateIOSProject(project, pinset));
};
