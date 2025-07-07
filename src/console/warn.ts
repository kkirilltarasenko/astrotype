import { modifiedConsole } from '@/console/base';
import { ConsoleVariants } from '@/types/console';

export const consoleWarn = (...messages: unknown[]) => {
  modifiedConsole(ConsoleVariants.WARN, messages);
};
