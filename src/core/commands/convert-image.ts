import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { consoleError, consoleInfo, consoleSuccess, consoleWarn } from '@/console';
import { CLI_Errors, CLI_Info } from '@/logs';
import { RootDataTypes, TRootMap } from '@/types/root';

export class ConvertImage {
  private readonly supportedFileExts: string[] = ['.jpeg', '.jpg', '.png', '.webp'];

  async execute(data: TRootMap) {
    const filePath = data.get(RootDataTypes.Path);

    if (!filePath) {
      consoleError(CLI_Errors.ConvertImageEmptyPath);
      return;
    }

    const fileExt = data.get(RootDataTypes.FileExtension);
    if (!fileExt) {
      consoleError(CLI_Errors.ConvertImageNotImage);
      return;
    }

    const [target] = filePath;
    const [targetExt] = fileExt;

    try {
      const absPath = this.walkDir(target, targetExt);
      consoleInfo(CLI_Info.StartConverting(absPath));

      const outputPath = await this.convert(absPath, targetExt);
      consoleSuccess(CLI_Info.SuccessConverting(outputPath));
    } catch (error) {
      consoleError(error);
    }
  }

  private walkDir(filePath: string, targetExt: string) {
    const resolvedPath = path.resolve(process.cwd(), filePath);

    const fileExt = path.extname(filePath);

    if (fileExt === targetExt) {
      throw new Error(CLI_Errors.ConvertSameExts);
    }

    const proposedPath = resolvedPath.replace(fileExt, targetExt);
    if (fs.existsSync(proposedPath)) {
      consoleWarn(CLI_Info.DeleteExisting(proposedPath));
      fs.unlinkSync(proposedPath);
    }

    if (!fileExt || !this.supportedFileExts.includes(fileExt)) {
      throw new Error(CLI_Errors.UnsupportedFileFormat(fileExt, this.supportedFileExts.join(' ')));
    }

    return resolvedPath;
  }

  private async convert(filePath: string, targetExt: string) {
    const outputPath = filePath.replace(path.extname(filePath), targetExt);
    try {
      await sharp(filePath)
        .toFormat(targetExt.replace('.', '') as keyof sharp.FormatEnum)
        .toFile(outputPath);
      return outputPath;
    } catch (error) {
      throw new Error((error as string).toString());
    }
  }
}
