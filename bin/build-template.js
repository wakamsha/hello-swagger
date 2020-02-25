'use strict';
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const argv = require('yargs').argv;

const specName = argv.spec;

fs.writeFileSync(
  path.resolve(__dirname, `../packages/${specName}/dist/index.html`),
  pug.renderFile(path.resolve(__dirname, '../packages/core/src/templates/index.pug'), {
    specName,
  }),
);

console.log(`Compiled ${specName}/dist/index.html`);
