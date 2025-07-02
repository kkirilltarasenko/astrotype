import yargs from 'yargs';

import { consoleError } from '@/console';
import { ARGS } from '@/consts/args';
import { COMMANDS_PREFIX, CommandsList } from '@/consts/commands';
// Commands
import { ApiFetcher } from '@/core/commands';
// Classes
import Flags from '@/core/flags';
// Utils
import { getFlagsString } from '@/utils/getFlagsString';

class Root {
  static readonly commands = {
    [CommandsList.API_TEST]: new ApiFetcher(),
  };

  static async init() {
    const args = await yargs(ARGS).parse();
    // Check if program has flags, like: -v, -f, -d ...
    const flags = getFlagsString(args);
    if (flags.length) {
      Flags.execute(flags);
    }

    // Executing available commands
    const commands = args[COMMANDS_PREFIX];
    commands.forEach((command) => {
      const commandFunction = this.commands[command as CommandsList];
      if (commandFunction) {
        commandFunction.execute();
      } else {
        consoleError(`Unknown command: ${command}`);
      }
    });
    return 0;
  }
}

export default Root;
