#!/usr/bin/env node

const minimist = require('minimist');
const Log = require('./Log');

const args = minimist(process.argv.slice(2), {
  boolean: ['help', 'version', 'check', 'force'],
  string: ['android', 'ios', 'project'],
  alias: {
    h: 'help',
    v: 'version',
    f: 'force',
    a: 'android',
    i: 'ios',
    p: 'project'
  }
});

let cmd = args._[0] || 'help';

if (args.version || args.v) {
  cmd = 'version';
}

if (args.help || args.h) {
  cmd = 'help';
}

// console.log(args);

switch (cmd) {
  case 'init':
    require('./cmds/init')(args);
    break;

  case 'gen':
    require('./cmds/gen')(args);
    break;

  case 'version':
    require('./cmds/version')(args);
    break;

  case 'help':
    require('./cmds/help')(args);
    break;

  default:
    Log.fatal(`"${cmd}" is not a valid command!`);
    break;
}
