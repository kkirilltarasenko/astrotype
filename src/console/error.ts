import { modifiedConsole } from '@/console/base';
import { ConsoleVariants } from '@/types/console';

export const consoleError = (...messages: unknown[]) => {
  modifiedConsole(ConsoleVariants.ERROR, messages);
};
