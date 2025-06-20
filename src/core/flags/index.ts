import { FlagsList, type TFlagKey } from '@/consts/flags';

class Flags {
  private static readonly version = '1.0.0';
  private static readonly instructions = {
    [FlagsList.v]: this.getVersion,
  };

  static execute = (args: string[]) => {
    args.forEach((arg) => {
      const argKey = arg as TFlagKey;
      const instruction = this.instructions[argKey];

      if (instruction) {
        instruction.call(this);
      }
    });
  };

  private static getVersion() {
    console.log(this.version);
  }
}

export default Flags;
