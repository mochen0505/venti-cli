#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const { VENTI_PATH, SERVER_PORT } = require('../scripts/constants')
const { resolve } = require('path')
const storybook = require('@storybook/react/standalone')

program
  .usage('[options]')
  .option('-p --port <port>', 'set storybook server port')

program.on('--help', () => {
  console.log(chalk.yellow('# run storybook with default port'));
  console.log(chalk.white('# vii dev'));
  console.log(chalk.yellow('# run storybook with custom port'));
  console.log(chalk.white('# vii dev -p <port>'));
})

const args = require('minimist')(process.argv.slice(2));

if (args.h || args.help) {
  program.help()
}

const port = args.p || args.port || SERVER_PORT;

storybook({
  mode: 'dev',
  configDir: resolve(VENTI_PATH, './.storybook'),
  port: port,
  quiet: true
})
