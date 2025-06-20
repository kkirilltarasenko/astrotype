import { Arguments } from 'yargs';
import { COMMANDS_PREFIX } from '@/consts/commands';

export const getFlagsString = (arg: Arguments) => {
  return Object.keys(arg).filter((key) => !Array.isArray(key) && key !== COMMANDS_PREFIX);
};
