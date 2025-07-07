import { Arguments } from 'yargs';

import { COMMANDS_PREFIX, SYSTEM_PREFIX } from '@/consts/commands';

export const getFlagsString = (arg: Arguments) => {
  return Object.entries(arg).filter(([key]) => !Array.isArray(key) && key !== COMMANDS_PREFIX && key !== SYSTEM_PREFIX);
};
