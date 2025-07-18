import { Worker } from 'node:worker_threads';

import fs from 'fs';
import path from 'path';

import { consoleError, consoleInfo, consoleSuccess, consoleWarn } from '@/console';
import { API_DIR, SUPPORTED_FILE_EXTENSIONS, WORKER_DIR } from '@/consts/commands';
import { CLI_Errors, CLI_Info } from '@/logs';
import { type TWorkerState, WORKER_STATES } from '@/types/commands';
import { getWorkerMessage } from '@/utils/getWorkerMessage';

export class ApiFetcher {
  private apiFiles: string[] = [];

  constructor() {
    fs.readdirSync(API_DIR).forEach((file) => {
      const fileExt = path.extname(file);

      if (!fileExt) {
        return;
      }

      if (!SUPPORTED_FILE_EXTENSIONS.includes(fileExt)) {
        consoleError(CLI_Errors.UnsupportedFileFormat(file, '.yaml'));
        return;
      }

      this.apiFiles.push(file);
      consoleInfo(CLI_Info.FileAdded(file));
    });
  }

  execute() {
    console.log();
    this.apiFiles.forEach((file) => {
      const worker = new Worker(WORKER_DIR, {
        workerData: {
          filePath: file,
        },
      });

      worker.on('message', (message: TWorkerState) => {
        switch (message.type) {
          case WORKER_STATES.Success:
            consoleSuccess(getWorkerMessage(file, message.payload));
            break;
          case WORKER_STATES.Error:
            consoleError(getWorkerMessage(file, message.payload));
            break;
          case WORKER_STATES.Warn:
            consoleWarn(getWorkerMessage(file, message.payload));
            break;
          default:
            break;
        }
      });

      worker.on('error', (err: unknown) => {
        let errorMessage: string;

        if (err instanceof Error) {
          if (err.message.includes('Cannot find module') || err.message.includes('ENOENT')) {
            errorMessage = CLI_Errors.MissingInputFile;
          } else {
            errorMessage = err.message;
          }
        } else {
          errorMessage = String(err);
        }

        consoleError(getWorkerMessage(file, errorMessage));
      });

      worker.on('exit', () => {
        consoleInfo(CLI_Info.WorkerForFileEnded(file));
      });
    });
  }
}
