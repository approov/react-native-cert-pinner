const Log = require('../Log');

const { version } = require('../../package.json')

module.exports = (args) => {
  Log.info(`v${version}`)
}