import { modifiedConsole } from '@/console/base';
import { ConsoleVariants } from '@/types/console';

export const consoleSuccess = (...messages: unknown[]) => {
  modifiedConsole(ConsoleVariants.SUCCESS, messages);
};
