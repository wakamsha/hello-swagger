const chokidar = require('chokidar');
const fs = require('fs');
const glob = require('glob');
const JsonRefs = require('json-refs');
const yaml = require('js-yaml');
const path = require('path');
const argv = require('yargs').argv;

const specName = argv.spec;
const watch = !!argv.watch;

if (!specName) {
  console.error('🙅‍♀️ app must be "pet-store"');
  process.exit(1);
}

function exec(e) {
  if (e && e !== 'modified') return;

  const rootYamlPath = path.resolve(__dirname, `../src/spec/${specName}/index.yaml`);

  JsonRefs.resolveRefs(yaml.load(fs.readFileSync(rootYamlPath).toString()), {
    location: rootYamlPath,
    filter: ['relative', 'remote'],
    loaderOptions: {
      processContent: (res, callback) => callback(null, yaml.load(res.text)),
    },
  }).then(results => {
    console.log(JSON.stringify(results.resolved, null, 2));
    fs.writeFileSync(
      path.resolve(__dirname, `../dist/spec/${specName}.json`),
      JSON.stringify(results.resolved, null, 2),
    );
  });
}

exec();
watch && chokidar.watch(glob.sync(path.resolve(__dirname, `../src/spec/${specName}/**/*.yaml`))).on('raw', exec);
