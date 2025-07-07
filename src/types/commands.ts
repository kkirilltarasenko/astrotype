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
}
