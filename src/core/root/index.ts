import yargs from 'yargs';

import { ARGS } from '@/consts/args';
// Classes
// import Flags from '@/core/commands/flags';
// Utils
import { getFlagsString } from '@/core/utils/getFlagsString';

class Root {
  static async init() {
    const args = await yargs(ARGS).parse();
    console.log(getFlagsString(args));
    console.log(args);
    // const flags = new Flags(['a', 'b']);
  }
}

export default Root;
