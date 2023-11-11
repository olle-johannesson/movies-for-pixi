const purgecss = require('@fullhuman/postcss-purgecss')


/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    purgecss({ content: ['./**/*.html'] })
  ]
}

module.exports = config
