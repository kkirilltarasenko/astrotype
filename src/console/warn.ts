import chalk from 'chalk';

export const consoleWarn = (...messages: unknown[]) => {
  messages.forEach((message) => {
    console.error(chalk.yellowBright(message));
  });
};
