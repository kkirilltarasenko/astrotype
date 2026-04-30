import { GoogleGenAI } from '@google/genai';

import { consoleError, consoleInfo, consoleSuccess, consoleWarn } from '@/console';
import { MessageContext } from '@/core/context/message-context';
import { CLI_Errors, CLI_Info } from '@/logs';
import { IAbstractCommand } from '@/types/commands';
import { RootDataTypes, type TRootMap } from '@/types/root';

export class Gemini implements IAbstractCommand {
  private readonly root: GoogleGenAI;
  private readonly messageContext: MessageContext;

  constructor() {
    this.root = new GoogleGenAI({});
    this.messageContext = new MessageContext('gemini-context');
  }

  async execute(rootMap: TRootMap) {
    const messages = rootMap.get(RootDataTypes.Message);
    if (!messages) {
      consoleError(CLI_Errors.GeminiEmptyMessage);
      return;
    }

    const [message] = messages;
    consoleInfo(CLI_Info.YourQuestion(message));

    if (process.env.DEVOLPMENT_ENV) {
      consoleWarn(this.messageContext.getMessageWithContext(message));
    }

    try {
      const completion = await this.root.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: this.messageContext.getMessageWithContext(message),
      });

      const completionResult = completion.text || 'No response from Gemini.';

      consoleSuccess(completionResult);

      this.messageContext.apply(message);
      this.messageContext.apply(completionResult);
    } catch (error) {
      consoleError(CLI_Errors.GeminiCompletionError(error));
    }
  }
}
