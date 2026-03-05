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
    const fileExt = data.get(RootDataTypes.FileExtension);

    if (!filePath) {
      consoleError(CLI_Errors.ConvertImageEmptyPath);
      return;
    }

    if (!fileExt) {
      consoleError(CLI_Errors.ConvertImageNotImage);
      return;
    }

    const [targetPath] = filePath;
    const [targetExt] = fileExt;

    try {
      const absPath = this.preparePath(targetPath, targetExt);

      consoleInfo(CLI_Info.StartConverting(absPath));

      const outputPath = await this.convert(absPath, targetExt);

      consoleSuccess(CLI_Info.SuccessConverting(outputPath));
    } catch (error) {
      consoleError(error instanceof Error ? error.message : error);
    }
  }

  private normalizeExt(ext: string) {
    return ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  }

  private preparePath(filePath: string, targetExt: string) {
    const resolvedPath = path.resolve(process.cwd(), filePath);

    const sourceExt = path.extname(resolvedPath).toLowerCase();
    const normalizedTargetExt = this.normalizeExt(targetExt);

    if (!sourceExt || !this.supportedFileExts.includes(sourceExt)) {
      throw new Error(CLI_Errors.UnsupportedFileFormat(sourceExt, this.supportedFileExts.join(' ')));
    }

    if (sourceExt === normalizedTargetExt) {
      throw new Error(CLI_Errors.ConvertSameExts);
    }

    const outputPath = resolvedPath.replace(sourceExt, normalizedTargetExt);

    if (fs.existsSync(outputPath)) {
      consoleWarn(CLI_Info.DeleteExisting(outputPath));
      fs.unlinkSync(outputPath);
    }

    return resolvedPath;
  }

  private async convert(filePath: string, targetExt: string) {
    const normalizedExt = this.normalizeExt(targetExt);
    const outputPath = filePath.replace(path.extname(filePath), normalizedExt);

    const format = normalizedExt.replace('.', '') as keyof sharp.FormatEnum;

    try {
      await sharp(filePath).toFormat(format).toFile(outputPath);

      return outputPath;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
