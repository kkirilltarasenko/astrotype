import { RootDataTypes } from '@/types/root';

export type TFlagFunctionReturnType = {
  payload: unknown;
  type: RootDataTypes;
};

export const enum FlagsList {
  v = 'v',
  m = 'm',
}

export type TFlagKey = keyof typeof FlagsList;
