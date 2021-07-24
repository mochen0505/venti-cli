#!/usr/bin/env node

const program = require('commander');
const Conf = require('conf');
const dayjs = require('dayjs');
const chalk = require('chalk');
const packageVersion = require('../package.json').version;
const requiredNodeVersion = require('../package.json').engines.node;
const { checkNodeVersion, checkVentiVersion, notifier } = require('../utils/checkVersion');


const config = new Conf();
const lastUpdatedDate = config.get('last-updated-date');
const currentDate = dayjs().format('YYYY-MM-DD');

function programConfig() {
  program
    .version(packageVersion)
    .usage('<cmd> [options]')
    .command('dev', 'Run storybook')
    .command('build', 'Build your library')
    .command('init', 'Create a template library')
    .command('lint', 'Lint the code')
    .command('changelog', 'Print the log')
    .parse(process.argv)
}

if(!lastUpdatedDate || currentDate !== lastUpdatedDate) {
  config.set('last-updated-date', currentDate);
  checkNodeVersion(requiredNodeVersion);
  checkVentiVersion().then(res => {
    const data = JSON.parse(res.body);
    const latest = data.version;
    notifier(latest);
    programConfig();
  }).catch(err => {
    console.log(chalk.red(err));
    process.exit(-1);
  });
} else {
  programConfig();
}

