import { FlagsList, type TFlagFunctionReturnType, type TFlagKey } from '@/types/flags';
import { RootDataTypes } from '@/types/root';

export class Flags {
  private readonly version = process.env.APP_VERSION || '0.0.0';
  instructions = {
    [FlagsList.v]: this.getVersion,
    [FlagsList.version]: this.getVersion,
    [FlagsList.m]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Message),
    [FlagsList.p]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Path),
    [FlagsList.path]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Path),
    [FlagsList.to]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.FileExtension),
    [FlagsList.q]: (arg: unknown) => this.getStringArg(arg, RootDataTypes.Quality),
    [FlagsList.help]: this.getHelp,
    [FlagsList.h]: this.getHelp,
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
  bundle-size     Анализ размера файлов в директории с компрессией

ДОСТУПНЫЕ ФЛАГИ:
  -v, --version   Показать версию программы
  -m              Сообщение для обработки
  -p, --path      Путь к файлу/директории
  --to            Расширение файла для конвертации
  --help, -h      Справочник команд
  -q              Качество для конвертации

ПРИМЕРЫ:
  astc gemini -m "Привет, как дела?"
  astc convert -p ./images --to png -q 100
  astc bundle-size -p ./dist
  astc api-test
  astc --help
  astc -v
`);
  }
}
