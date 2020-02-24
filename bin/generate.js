const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const JsonRefs = require('json-refs');
const yaml = require('js-yaml');

const specName = argv.spec;

if (!specName) {
  console.error('🙅‍♀️ app must be "pet-store"');
  process.exit(1);
}

const rootYamlPath = path.resolve(__dirname, `../src/spec/${specName}/index.yaml`);

JsonRefs.resolveRefs(yaml.load(fs.readFileSync(rootYamlPath).toString()), {
  location: rootYamlPath,
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: (res, callback) => callback(null, yaml.load(res.text)),
  },
}).then(results => {
  fs.writeFileSync(path.resolve(__dirname, `../dist/spec/${specName}.json`), JSON.stringify(results.resolved, null, 2));
});
