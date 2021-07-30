#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const ora = require('ora')
const { rollup } = require('rollup')
const getRollupConfigs = require('../scripts/config/rollup.config')


program
  .usage('[options]')
  .option('-s --scope <scope>', 'build specific component')

program.on('--help', () => {
  console.log(chalk.yellow('# Build all the components'));
  console.log(chalk.white('# vii build'));
  console.log(chalk.yellow('# Build specific component'));
  console.log(chalk.white('# vii build -s <scope>'));
})

const args = require('minimist')(process.argv.slice(2));

if (args.h || args.help) {
  program.help()
}

const scope = args.s || args.scope

const spinner = ora({
  color: 'yellow',
  text: chalk.yellow('# Building...'),
})

spinner.start()

const rollupConfigs = getRollupConfigs(scope)
rollupConfigs.map(item => {
  const { output, ...props } = item
  rollup(props).then(bundle => {
    spinner.stop()
    console.log(chalk.yellow('# Built successfully.'));
    bundle.write(output)
  }).catch(error => {
    console.log(chalk.red(error));
    process.exit(-1)
  })
})

