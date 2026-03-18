import yargs from 'yargs';

import { consoleError } from '@/console';
import { ARGS } from '@/consts/args';
import { COMMANDS_PREFIX } from '@/consts/commands';
import { ApiFetcher, ConvertImage, Gemini } from '@/core/commands';
import { Flags } from '@/core/flags';
import { isString } from '@/typeguards';
import { CommandsList } from '@/types/commands';
import { RootDataTypes, type TRootMap } from '@/types/root';
import { getFlagsString } from '@/utils/getFlagsString';

class Root {
  static readonly availableClasses = {
    [CommandsList.API_TEST]: ApiFetcher,
    [CommandsList.GEMINI]: Gemini,
    [CommandsList.CONVERT_IMAGE]: ConvertImage,
  };
  static readonly availableFlags: TRootMap = new Map();

  static async init() {
    const args = await yargs(ARGS)
      .help(false) // Отключаем встроенную справку yargs
      .version(false) // Отключаем встроенную версию yargs
      .parse();
    // Check if program has flags, like: -v, -f, -d, -m, --to ...
    const flags = getFlagsString(args);
    let isHelpRequested = false;

    if (flags.length) {
      const parsedFlagsData = new Flags().execute(flags);
      if (parsedFlagsData.length) {
        parsedFlagsData.forEach((result) => {
          if (!result) return;

          const { type, payload } = result;

          console.log(type);
          // Check if help was requested
          if (type === RootDataTypes.Help) {
            isHelpRequested = true;
            return;
          }

          if (isString(payload)) {
            const existing = this.availableFlags.get(type) || [];
            this.availableFlags.set(type, [...existing, payload]);
          }
        });
      }
    }

    console.log(this.availableFlags);

    // If help was requested, exit early
    if (isHelpRequested) {
      return 0;
    }

    // Executing available commands
    const commands = args[COMMANDS_PREFIX];
    if (commands.length) {
      commands.forEach((command) => {
        try {
          const commandFunction = new this.availableClasses[command as CommandsList]();
          if (commandFunction) {
            commandFunction.execute(this.availableFlags);
          }
        } catch {
          consoleError(`Unknown command: ${command}`);
        }
      });
    }

    return 0;
  }
}

export default Root;
