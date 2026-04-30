import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { consoleError, consoleInfo, consoleSuccess, consoleWarn } from '@/console';
import { CLI_Errors, CLI_Info } from '@/logs';
import type { IAbstractCommand } from '@/types/commands';
import type { TConvertArgs } from '@/types/convert-image';
import { RootDataTypes, TRootMap } from '@/types/root';

export class ConvertImage implements IAbstractCommand {
  private readonly supportedFileExts: string[] = ['.jpeg', '.jpg', '.png', '.webp'];

  private isFolder: boolean = false;
  private quality: number = 80;

  async execute(data: TRootMap) {
    const filePath = data.get(RootDataTypes.Path);
    const fileExt = data.get(RootDataTypes.FileExtension);
    const quality = data.get(RootDataTypes.Quality);

    if (!filePath) {
      consoleError(CLI_Errors.ConvertImageEmptyPath);
      return;
    }

    if (!fileExt) {
      consoleError(CLI_Errors.UnsupportedFileFormat);
      return;
    }

    const [targetPath] = filePath;

    try {
      if (this.checkIsPathToDir(targetPath)) {
        this.isFolder = true;
      }
    } catch (error) {
      consoleError(error instanceof Error ? error.message : error);
      return;
    }

    let targetQuality: number | undefined = undefined;
    try {
      targetQuality = this.prepareQuality(quality);
    } catch (error) {
      consoleError(error instanceof Error ? error.message : error);
      return;
    }

    const [targetExt] = fileExt;

    try {
      if (this.isFolder) {
        consoleInfo(CLI_Info.StartConvertingFolder(targetPath));
        const outputPath = this.prepareFolderPath(targetPath, targetExt);

        await this.convertFolder(targetPath, outputPath, targetExt, targetQuality);
        consoleSuccess(CLI_Info.SuccessConvertingFolder(outputPath));
      } else {
        const absPath = this.prepareFilePath(targetPath, targetExt);
        consoleInfo(CLI_Info.StartConverting(absPath));

        const outputPath = await this.convert({
          filePath: absPath,
          targetExt,
        });
        consoleSuccess(CLI_Info.SuccessConverting(outputPath));
      }
    } catch (error) {
      consoleError(error instanceof Error ? error.message : error);
    }
  }

  private prepareQuality(quality: string[] | undefined) {
    if (!quality) {
      return undefined;
    }

    const [targetQuality] = quality;
    const numericQuality = Number(targetQuality);

    if (Number.isNaN(numericQuality)) {
      throw new Error(CLI_Errors.InvalidQualityValue(targetQuality));
    }

    if (numericQuality < 1 || numericQuality > 100) {
      throw new Error(CLI_Errors.QualityOutOfRange(numericQuality));
    }

    return numericQuality;
  }

  private checkIsPathToDir(arg: string) {
    const fullPath = path.resolve(process.cwd(), arg);
    try {
      return fs.statSync(fullPath).isDirectory();
    } catch {
      throw new Error(CLI_Errors.DirNotExists(fullPath));
    }
  }

  private normalizeExt(ext: string) {
    return ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  }

  private buildFolderOutputPath(dirPath: string, targetExt: string) {
    const folderName = path.basename(dirPath);
    const parentDir = path.dirname(dirPath);

    const normalizedTargetExt = this.normalizeExt(targetExt).replace('.', '');

    const utcDate = new Date().toISOString().replace(/[:.]/g, '-');

    const newFolderName = `${folderName}_${normalizedTargetExt}_${utcDate}`;

    return path.join(parentDir, newFolderName);
  }

  private prepareFilePath(filePath: string, targetExt: string) {
    const resolvedPath = path.resolve(process.cwd(), filePath);

    const sourceExt = path.extname(resolvedPath).toLowerCase();

    const normalizedTargetExt = this.normalizeExt(targetExt);

    if (sourceExt === normalizedTargetExt) {
      throw new Error(CLI_Errors.ConvertSameExts);
    }

    if (!sourceExt || !this.supportedFileExts.includes(sourceExt)) {
      throw new Error(CLI_Errors.UnsupportedFileFormat(sourceExt, this.supportedFileExts.join(' ')));
    }

    const outputPath = resolvedPath.replace(sourceExt, normalizedTargetExt);

    if (fs.existsSync(outputPath)) {
      consoleWarn(CLI_Info.DeleteExisting(outputPath));
      fs.unlinkSync(outputPath);
    }

    return resolvedPath;
  }

  private prepareFolderPath(filePath: string, targetExt: string) {
    const resolvedPath = path.resolve(process.cwd(), filePath);

    const normalizedTargetExt = this.normalizeExt(targetExt);

    const outputDir = this.buildFolderOutputPath(resolvedPath, normalizedTargetExt);

    if (fs.existsSync(outputDir)) {
      consoleWarn(CLI_Info.DeleteExisting(outputDir));
      fs.rmSync(outputDir, { recursive: true, force: true });
    }

    fs.mkdirSync(outputDir, { recursive: true });

    return outputDir;
  }

  private async convertFolder(inputDir: string, outputDir: string, targetExt: string, targetQuality?: number) {
    const files = fs.readdirSync(inputDir);

    const tasks = files.map(async (file) => {
      const fullPath = path.join(inputDir, file);
      const stat = fs.statSync(fullPath);

      if (!stat.isFile()) return;

      const ext = path.extname(fullPath).toLowerCase();

      if (!this.supportedFileExts.includes(ext)) {
        consoleWarn(CLI_Info.SkipUnsupported(file));
        return;
      }

      const outputFile = path.join(outputDir, file).replace(ext, this.normalizeExt(targetExt));

      try {
        const result = await this.convert({
          filePath: fullPath,
          targetExt,
          customOutputPath: outputFile,
          targetQuality,
        });

        consoleSuccess(CLI_Info.SuccessConverting(result));
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
      }
    });

    await Promise.all(tasks);
  }

  private async convert({ filePath, targetExt, customOutputPath, targetQuality }: TConvertArgs) {
    const normalizedExt = this.normalizeExt(targetExt);
    const outputPath = customOutputPath ?? filePath.replace(path.extname(filePath), normalizedExt);

    const format = normalizedExt.replace('.', '') as keyof sharp.FormatEnum;

    try {
      await sharp(filePath)
        .toFormat(format, { quality: targetQuality ?? this.quality })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
