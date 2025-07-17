const { parentPort, workerData } = require('node:worker_threads');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const RESULT = {
  total: 0,
  success: 0,
  error: 0,
}

const WORKER_STATES = {
  Success: 'Success',
  Error: 'Error',
  Warn: 'Warn'
}

const getFullPath = (filePath) => path.resolve(__dirname, `../api/${filePath}`);

const makeRequests = async (urls) => {
  for (const url of urls) {
    RESULT.total++;

    const response = await fetch(url);

    if (!response.ok) {
      parentPort.postMessage({
        type: WORKER_STATES.Error,
        payload: `Error on fetching ${url} worker, status: ${response.status}`,
      });
      RESULT.error++;

      continue;
    }

    parentPort.postMessage({
      type: WORKER_STATES.Success,
      payload: `Url: ${url}, has successfully been passed!`
    });

    RESULT.success++;
  }
}

const { filePath } = workerData;

const init = async () => {
  const fullPath = getFullPath(filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');

  if (fileContent) {
    const parsedFile = YAML.parse(fileContent);
    const { urls } = parsedFile;

    if (urls && urls.length) {
      await makeRequests(urls);

      parentPort.postMessage({
        type: WORKER_STATES.Warn,
        payload: `Total processed: ${RESULT.total}, Success: ${RESULT.success}, Errors: ${RESULT.error}`
      });
    } else {
      parentPort.postMessage({
        type: WORKER_STATES.Error,
        payload: 'Urls object must be defined. Please see the example.',
      });
    }
  }
}

(async () => {
  await init()
})();
