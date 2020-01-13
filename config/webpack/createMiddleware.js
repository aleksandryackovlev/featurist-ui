const path = require('path');

const express = require('express');
const chokidar = require('chokidar');
const { pathToRegexp } = require('path-to-regexp');
const jsf = require('json-schema-faker');
const SwaggerParser = require('swagger-parser');

module.exports = ({ file, locale = 'en' }) => {
  const router = express.Router();
  const watcher = chokidar.watch(path.dirname(file));

  jsf.extend('faker', () => {
    const faker = require('faker');
    faker.locale = locale;
    return faker;
  });
  jsf.define('example', value => value);
  jsf.define('examples', value =>
    Object.keys(value).length ? value[Object.keys(value)[0]].value : ''
  );

  let operations = null;

  watcher.on('all', () => {
    operations = null;
  });

  router.use('/*', async (req, res) => {
    const {
      method,
      _parsedUrl: { pathname },
    } = req;

    if (!operations) {
      const api = await SwaggerParser.dereference(file);

      operations = Object.keys(api.paths).reduce((resultOps, apiPath) => {
        const pathPattern = apiPath.replace(/\{([^/}]+)\}/g, (p1, p2) => `:${p2}`);
        const pathRegexp = pathToRegexp(pathPattern);

        const pathOperations = api.paths[apiPath];

        return [
          ...resultOps,
          ...Object.keys(pathOperations).map(pathMethod => {
            const resultOp = {
              method: pathMethod.toUpperCase(),
              pathPattern,
              pathRegexp,
              responseSchema:
                pathOperations[pathMethod].responses['200'] &&
                pathOperations[pathMethod].responses['200'].content['application/json'].schema,
              resp:
                pathOperations[pathMethod].responses['200'] &&
                pathOperations[pathMethod].responses['200'].content['application/json'],
            };

            if (resultOp.responseSchema && resultOp.resp && resultOp.resp.example) {
              resultOp.responseSchema.example = resultOp.resp.example;
            }

            if (resultOp.responseSchema && resultOp.resp && resultOp.resp.examples) {
              resultOp.responseSchema.examples = resultOp.resp.examples;
            }

            return resultOp;
          }),
        ];
      }, []);
    }

    const matchedOperation = operations.find(
      ({ method: operationMethod, pathRegexp }) =>
        pathRegexp.exec(pathname) && method === operationMethod
    );

    if (matchedOperation) {
      const result = matchedOperation.responseSchema
        ? matchedOperation.responseSchema.example ||
          (matchedOperation.responseSchema.examples &&
            matchedOperation.responseSchema.examples[
              Object.keys(matchedOperation.responseSchema.examples)[0]
            ].value) ||
          jsf.generate(matchedOperation.responseSchema)
        : {};

      return res.json(result);
    }

    res.status(404);
    return res.json({
      status: 'not found',
    });
  });

  return router;
};
