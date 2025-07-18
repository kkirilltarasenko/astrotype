import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Api-Fetcher
export const WORKER_DIR = path.resolve(__dirname, '../../scripts/api-fetcher-worker.cjs');
export const API_DIR = path.resolve(__dirname, '../../api');
export const SUPPORTED_FILE_EXTENSIONS = ['.yaml'];

// System
export const COMMANDS_PREFIX = '_';
export const SYSTEM_PREFIX = '$0';
