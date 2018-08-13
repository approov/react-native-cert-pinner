const chalk = require('chalk');

const Log = {
  info: (msg) => {
    console.log(msg);
  },

  warn: (msg) => {
    console.log(chalk.yellowBright(msg));
  },

  error: (msg) => {
    console.error(chalk.redBright(msg));
  },

  fatal: (msg) => {
    console.error(chalk.redBright(msg));
    process.exit(1)
  }
};

module.exports = Log;
