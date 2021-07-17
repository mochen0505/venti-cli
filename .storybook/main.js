const { resolve } = require('path')
const { PROJECT_PATH } = require('../scripts/constants')
const glob = require('glob')

module.exports = {
  stories: glob.sync(`${resolve(PROJECT_PATH, './packages')}/**/stories/*.stories.@(js|jsx|ts|tsx)`),
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  core: {
    "builder": "webpack5"
  },
  webpackFinal: async (config) => {
    // Ensure shared component stories are transpiled.
    config.module.rules[0].include.push(
      resolve(PROJECT_PATH)
    );

    return config;
  }
}
