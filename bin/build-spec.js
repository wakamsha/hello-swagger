const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const JsonRefs = require('json-refs');
const yaml = require('js-yaml');

const specName = argv.spec;

if (!specName) {
  console.error('🙅‍♀️ API name must be passed as the sole argument: node bin/build.js --spec <spec name>');
  process.exit(1);
}

const rootYamlPath = path.resolve(__dirname, `../packages/${specName}/src/index.yaml`);

JsonRefs.resolveRefs(yaml.load(fs.readFileSync(rootYamlPath).toString()), {
  location: rootYamlPath,
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: (res, callback) => callback(null, yaml.load(res.text)),
  },
}).then(results => {
  fs.writeFileSync(
    path.resolve(__dirname, `../packages/${specName}/dist/spec/${specName}.json`),
    JSON.stringify(results.resolved, null, 2),
  );
});

console.log(`Building the API document for ${specName}...`);
