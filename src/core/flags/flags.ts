import { FlagsList, type TFlagFunctionReturnType, type TFlagKey } from '@/types/flags';
import { RootDataTypes } from '@/types/root';

export class Flags {
  private readonly version = '1.0.0';
  instructions = {
    [FlagsList.v]: this.getVersion,
    [FlagsList.m]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Message),
    [FlagsList.p]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Path),
    [FlagsList.to]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.FileExtension),
    [FlagsList.help]: this.getHelp,
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

  private getHelp(arg: unknown): TFlagFunctionReturnType {
    this.displayHelp();
    return { payload: arg, type: RootDataTypes.Help };
  }

  private displayHelp(): void {
    console.log(`
AstroType CLI - Справочник по командам

ИСПОЛЬЗОВАНИЕ:
  astrotype [КОМАНДА] [ФЛАГИ]

ДОСТУПНЫЕ КОМАНДЫ:
  api-test        Тестирование API endpoints
  gemini          Взаимодействие с Gemini AI
  convert-image   Конвертация изображений

ДОСТУПНЫЕ ФЛАГИ:
  -v, --version   Показать версию программы
  -m              Сообщение для обработки
  -p              Путь к файлу
  --to            Расширение файла для конвертации
  --help          Показать эту справку

ПРИМЕРЫ:
  astrotype gemini -m "Привет, как дела?"
  astrotype convert-image -p ./image.jpg --to png
  astrotype api-test
  astrotype --help
  astrotype -v
`);
  }
}
