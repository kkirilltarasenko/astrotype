import yargs from "yargs";
import * as process from 'node:process';
import { ARGS } from '@/consts';

class Root {
  static showArgs() {
    if (process.argv.length > 1) {
      console.log(yargs(ARGS).parse())
    } else {
      console.warn("No args provided...")
    }
  }
}

export default Root;