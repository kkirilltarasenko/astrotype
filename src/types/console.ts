import chalk from 'chalk';

export const ConsoleVariants = {
  SUCCESS: chalk.greenBright,
  ERROR: chalk.redBright,
  INFO: chalk.blueBright,
  WARN: chalk.yellowBright,
} as const;

export type TConsoleVariant = (typeof ConsoleVariants)[keyof typeof ConsoleVariants];
