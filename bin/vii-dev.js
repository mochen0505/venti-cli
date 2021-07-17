#!/usr/bin/env node

const { SPEAR_PATH } = require('../scripts/constants')
const { resolve } = require('path')
const storybook = require('@storybook/react/standalone')

storybook({
  mode: 'dev',
  configDir: resolve(SPEAR_PATH, './.storybook'),
  port: 6006,
  quiet: true
})
