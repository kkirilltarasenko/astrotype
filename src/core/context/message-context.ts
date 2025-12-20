import fs from 'fs';
import path from 'path';

import { consoleError } from '@/console';

export class MessageContext {
  context: string[];
  pathToFile: string;

  constructor(fileName: string) {
    this.pathToFile = path.join(process.cwd(), 'temporary-files', `${fileName}.txt`);
    this.context = this.loadContextFromFile();
  }

  private isEven = (num: number) => num % 2 === 0;

  public getMessageWithContext = (message: string) => {
    const previousMessages = this.context
      .map((msg, index) => `${this.isEven(index + 1) ? 'YOUR ANSWER WAS:' : 'MY QUESTION WAS:'}: ${msg}`)
      .join('\n');

    const context = previousMessages
      ? `${previousMessages}\n\n\n---- CURRENT MESSAGE -----:\n${message}`
      : `\n\n\n---- CURRENT MESSAGE -----:\n${message}`;

    return `DO NOT ANSWER IN STYLE WITH YOUR ANSWER WAS, MY QUESTION WAS, USE IT INFORMATION IF IT'S CAN HELP YOU, BECAUSE IT'S THE CONTEXT OF OUR CONVERSATION!!!\n\n\nCONTEXT: ----\n\n\n${context}\n\n\n ---- END OF CONTEXT`;
  };

  public apply = (message: string) => {
    this.context = [...this.context, message];

    try {
      fs.appendFileSync(this.pathToFile, `${message}\n`, 'utf-8');
    } catch (error) {
      consoleError(error);
    }
  };

  private loadContextFromFile() {
    try {
      if (!fs.existsSync(this.pathToFile)) {
        return [];
      }

      const content = fs.readFileSync(this.pathToFile, 'utf-8').trim();

      if (!content) {
        return [];
      }

      return content.split('\n');
    } catch (error) {
      consoleError(error);
      return [];
    }
  }
}
