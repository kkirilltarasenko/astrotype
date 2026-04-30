import { RootDataTypes } from '@/types/root';

export type TFlagFunctionReturnType = {
  payload: unknown;
  type: RootDataTypes;
};

export const enum FlagsList {
  v = 'v',
  version = 'version',
  m = 'm',
  p = 'p',
  path = 'path',
  to = 'to',
  help = 'help',
  h = 'h',
  q = 'q',
}

export type TFlagKey = keyof typeof FlagsList;
