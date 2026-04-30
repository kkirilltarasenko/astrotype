import { TRootMap } from '@/types/root';

export const WORKER_STATES = {
  Success: 'Success',
  Error: 'Error',
  Warn: 'Warn',
} as const;

type TWorkerType = (typeof WORKER_STATES)[keyof typeof WORKER_STATES];

export type TWorkerState = {
  type: TWorkerType;
  payload: string;
};

export const enum CommandsList {
  API_TEST = 'api-test',
  GEMINI = 'gemini',
  CONVERT_IMAGE = 'convert',
  BUNDLE_SIZE = 'bundle-size',
}

export interface IAbstractCommand {
  execute: (data: TRootMap) => Promise<void>;
}

export interface IFileInfo {
  path: string;
  size: number;
  gzip: number;
  brotli: number;
  extension: string;
}

export interface IBundleStats {
  totalFiles: number;
  totalRawSize: number;
  totalGzipSize: number;
  totalBrotliSize: number;
  filesByExtension: Map<string, number>;
  sizeByExtension: Map<string, number>;
}
