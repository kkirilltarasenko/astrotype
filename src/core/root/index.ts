import yargs from 'yargs';

import { ARGS } from '@/consts/args';
// Classes
import Flags from '@/core/flags';
// Utils
import { getFlagsString } from '@/utils/getFlagsString';

class Root {
  static async init() {
    const args = await yargs(ARGS).parse();

    // Check if program has flags, like: -v, -f, -d ...
    const flags = getFlagsString(args);
    if (flags.length) {
      Flags.execute(flags);
    }

    return 0;
  }
}

export default Root;
