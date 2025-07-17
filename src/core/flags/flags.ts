import { FlagsList, type TFlagFunctionReturnType, type TFlagKey } from '@/types/flags';
import { RootDataTypes } from '@/types/root';

class Flags {
  private readonly version = '1.0.0';
  instructions = {
    [FlagsList.v]: this.getVersion,
    [FlagsList.m]: this.getMessage,
  };

  execute = (args: [string, unknown][]) =>
    args.map(([arg, value]) => {
      const argKey = arg as TFlagKey;
      const instruction = this.instructions[argKey];

      if (instruction) {
        return instruction.call(this, value);
      }
    });

  private getVersion(arg: unknown): TFlagFunctionReturnType {
    console.log(this.version);

    return { payload: arg, type: RootDataTypes.Version };
  }

  getMessage(arg: unknown): TFlagFunctionReturnType {
    return { payload: arg, type: RootDataTypes.Message };
  }
}

export default Flags;
