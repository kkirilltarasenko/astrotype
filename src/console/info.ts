import chalk from 'chalk';

export const consoleInfo = (...messages: unknown[]) => {
  messages.forEach((message) => {
    console.error(chalk.blueBright(message));
  });
};
