import { GoogleGenAI } from '@google/genai';

import { consoleError, consoleInfo, consoleSuccess } from '@/console';
import { CLI_Errors, CLI_Info } from '@/logs';
import { RootDataTypes, type TRootMap } from '@/types/root';

export class Gemini {
  private readonly root: GoogleGenAI;

  constructor() {
    this.root = new GoogleGenAI({});
  }

  async execute(rootMap: TRootMap) {
    const messages = rootMap.get(RootDataTypes.Message);
    if (!messages) {
      consoleError(CLI_Errors.GeminiEmptyMessage);
      return;
    }

    const [message] = messages;
    consoleInfo(CLI_Info.YourQuestion(message));

    try {
      const completion = await this.root.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
      });

      consoleSuccess(completion.text || 'No response from Gemini.');
    } catch (error) {
      consoleError(CLI_Errors.GeminiCompletionError(error));
    }
  }
}
