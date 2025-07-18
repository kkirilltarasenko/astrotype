import { FlagsList, type TFlagFunctionReturnType, type TFlagKey } from '@/types/flags';
import { RootDataTypes } from '@/types/root';

export class Flags {
  private readonly version = '1.0.0';
  instructions = {
    [FlagsList.v]: this.getVersion,
    [FlagsList.m]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Message),
    [FlagsList.p]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Path),
    [FlagsList.to]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.FileExtension),
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

  getStringArg(arg: unknown, type: RootDataTypes): TFlagFunctionReturnType {
    return { payload: arg, type };
  }
}
