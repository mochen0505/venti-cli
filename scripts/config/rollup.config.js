const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const { resolve } = require('path')
const glob = require('glob')
const chalk = require('chalk')
const { PROJECT_PATH } = require('../constants')

function setPlugins() {
  return [
    nodeResolve(),
    commonjs(),
    terser()
  ]
}

function getRollupConfigs(scope) {
  
  const allEntry = glob.sync(`${resolve(PROJECT_PATH, './packages')}/**/index.js`)
    .reduce((x, y) => Object.assign(x, {
      [y.split('/').slice(-2, -1)]: y,
    }), {});

  let entry;

  if (scope) {
    if (!Object.keys(allEntry).includes(scope)) {
      console.log(chalk.red('# No such a component.'))
      process.exit(-1)
    } else {
      entry = {
        [scope]: `${resolve(PROJECT_PATH, './packages')}/${scope}/index.js`
      };
    }
  } else {
    entry = allEntry
  }

  const rollupConfigs = [];
  for (let [key, value] of Object.entries(entry)) {
    rollupConfigs.push({
      input: value,
      output: {
        dir: resolve(PROJECT_PATH, `./packages/${key}/dist`),
        format: 'es',
        sourcemap: true
      },
      plugins: setPlugins()
    })
  }
  return rollupConfigs
}

module.exports = getRollupConfigs
