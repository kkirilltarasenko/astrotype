import chalk from 'chalk';

export const consoleSuccess = (...messages: unknown[]) => {
  messages.forEach((message) => {
    console.error(chalk.greenBright(message));
  });
};
