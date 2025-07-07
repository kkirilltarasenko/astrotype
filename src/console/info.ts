import { modifiedConsole } from '@/console/base';
import { ConsoleVariants } from '@/types/console';

export const consoleInfo = (...messages: unknown[]) => {
  modifiedConsole(ConsoleVariants.INFO, messages);
};
