import { TConsoleVariant } from '@/types/console';

export const modifiedConsole = (type: TConsoleVariant, ...args: unknown[]) => {
  args.forEach((message) => {
    console.log(type(message));
  });
};
