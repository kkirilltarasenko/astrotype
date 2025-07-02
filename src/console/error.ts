import chalk from 'chalk';

export const consoleError = (...messages: unknown[]) => {
  messages.forEach((message) => {
    console.error(chalk.redBright(message));
  });
};
