import fs from 'fs';
import path from 'path';

import { consoleError } from '@/console';
import { CLI_Errors } from '@/logs';
import { IAbstractCommand } from '@/types/commands';
import { RootDataTypes, TRootMap } from '@/types/root';

export class BundleAnalyze implements IAbstractCommand {
  private fileMap = new Map<string, string>();
  async execute(data: TRootMap) {
    const [pathToDir] = data.get(RootDataTypes.Path) ?? [];

    this.processDir(pathToDir);
  }

  private getAbsolutePathToDir(inputPath: string) {
    const absolutePath = path.isAbsolute(inputPath) ? inputPath : path.resolve(process.cwd(), inputPath);

    if (!fs.existsSync(absolutePath)) {
      consoleError(CLI_Errors.DirNotExists(absolutePath));
      return;
    }
    if (!fs.statSync(absolutePath).isDirectory()) {
      consoleError(CLI_Errors.PathIsNotDir(absolutePath));
      return;
    }

    return absolutePath;
  }

  private hasSameFileName(fileName: string) {
    return this.fileMap.has(fileName);
  }

  private extractLastFolder(path: string) {
    const pathArray = path.split('/');
    return pathArray[pathArray.length - 2];
  }

  private scanDirectoryForFiles(inputPath: string) {
    try {
      const files = fs.readdirSync(inputPath);
      files.forEach((file) => {
        const currentFilePath = path.resolve(inputPath, file);
        const fileStats = fs.statSync(currentFilePath);

        if (fileStats.isDirectory()) {
          return this.scanDirectoryForFiles(currentFilePath);
        } else {
          this.fileMap.set(
            this.hasSameFileName(file) ? `${this.extractLastFolder(currentFilePath)}/${file}` : file,
            currentFilePath,
          );
        }
      });
    } catch (error: unknown) {
      console.log(error);
      return;
    }
  }

  private processDir(pathToDir: string) {
    const absolutePath = this.getAbsolutePathToDir(pathToDir);

    if (!absolutePath) return;

    this.scanDirectoryForFiles(absolutePath);
    console.log(this.fileMap, 'MAP');
  }
}
