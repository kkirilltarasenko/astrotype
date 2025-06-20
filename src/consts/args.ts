import * as process from 'node:process';

const DEFAULT_PROCESS_ARGS_INDEX = 2;

export const ARGS = process.argv.slice(DEFAULT_PROCESS_ARGS_INDEX);
