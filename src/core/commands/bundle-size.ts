import { sync as brotliSizeSync } from 'brotli-size';
import fs from 'fs';
import { gzipSizeSync } from 'gzip-size';
import path from 'path';

import { consoleError, consoleInfo } from '@/console';
import { CLI_Errors, CLI_Info } from '@/logs';
import { IAbstractCommand, IBundleStats, IFileInfo } from '@/types/commands';
import { RootDataTypes, TRootMap } from '@/types/root';

export class BundleSize implements IAbstractCommand {
  private fileMap = new Map<string, IFileInfo>();
  async execute(data: TRootMap) {
    const [pathToDir] = data.get(RootDataTypes.Path) ?? [];

    if (!pathToDir) {
      consoleError(CLI_Errors.PathNotProvided);
      return;
    }

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

  private getDepthSize(fileName: string) {
    return this.fileMap.has(fileName)
      ? this.fileMap.entries().reduce((acc, [key]) => {
          if (key === fileName) {
            acc += 1;
          }
          return acc;
        }, 0)
      : 0;
  }

  private generateFileKey(path: string, depthSize: number) {
    const pathArray = path.split('/');

    if (pathArray.length <= depthSize) {
      return path;
    }

    const resultKey = [pathArray[pathArray.length - 1]];
    let startIndex = 2;
    const endIndex = depthSize + startIndex;

    while (startIndex !== endIndex) {
      resultKey.push(pathArray[pathArray.length - startIndex]);
      startIndex += 1;
    }

    return resultKey.reverse().join('/');
  }

  private scanDirectoryForFiles(inputPath: string) {
    try {
      const files = fs.readdirSync(inputPath, { withFileTypes: true });
      files.forEach((file) => {
        if (file.isSymbolicLink()) {
          return;
        }

        const currentFilePath = path.resolve(inputPath, file.name);

        if (file.isDirectory()) {
          return this.scanDirectoryForFiles(currentFilePath);
        } else {
          const fileStats = fs.statSync(currentFilePath);
          const depthSize = this.getDepthSize(file.name);
          const key = depthSize ? this.generateFileKey(currentFilePath, depthSize) : file.name;
          const fileBuffer = fs.readFileSync(currentFilePath);
          const extension = path.extname(file.name).toLowerCase() || 'no-ext';

          this.fileMap.set(key, {
            path: currentFilePath,
            size: fileStats.size,
            gzip: gzipSizeSync(fileBuffer),
            brotli: brotliSizeSync(fileBuffer),
            extension,
          });
        }
      });
    } catch (error: unknown) {
      console.log(error);
      return;
    }
  }

  private calculateBundleStats(): IBundleStats {
    let totalRawSize = 0;
    let totalGzipSize = 0;
    let totalBrotliSize = 0;

    const filesByExtension = new Map<string, number>();
    const sizeByExtension = new Map<string, number>();

    for (const [, fileInfo] of this.fileMap) {
      totalRawSize += fileInfo.size;
      totalGzipSize += fileInfo.gzip;
      totalBrotliSize += fileInfo.brotli;

      const currentCount = filesByExtension.get(fileInfo.extension) || 0;
      filesByExtension.set(fileInfo.extension, currentCount + 1);

      const currentSize = sizeByExtension.get(fileInfo.extension) || 0;
      sizeByExtension.set(fileInfo.extension, currentSize + fileInfo.size);
    }

    return {
      totalFiles: this.fileMap.size,
      totalRawSize,
      totalGzipSize,
      totalBrotliSize,
      filesByExtension,
      sizeByExtension,
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  private formatMB(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  private printBundleReport(stats: IBundleStats, dirPath: string): void {
    consoleInfo(CLI_Info.BundleSize.Dir(dirPath));

    console.log(CLI_Info.BundleSize.Separator('-', 30));

    consoleInfo(CLI_Info.BundleSize.Overall);

    console.log(CLI_Info.BundleSize.TotalFiles(stats.totalFiles));

    console.log(
      CLI_Info.BundleSize.Size('Raw Size', this.formatBytes(stats.totalRawSize), this.formatMB(stats.totalRawSize)),
    );
    console.log(
      CLI_Info.BundleSize.Size('Gzipped', this.formatBytes(stats.totalGzipSize), this.formatMB(stats.totalGzipSize)),
    );
    console.log(
      CLI_Info.BundleSize.Size(
        ' Brotli',
        this.formatBytes(stats.totalBrotliSize),
        this.formatMB(stats.totalBrotliSize),
      ),
    );

    const gzipRatio = ((1 - stats.totalGzipSize / stats.totalRawSize) * 100).toFixed(1);
    const brotliRatio = ((1 - stats.totalBrotliSize / stats.totalRawSize) * 100).toFixed(1);

    console.log(CLI_Info.BundleSize.Compression('Gzip Compression', gzipRatio));
    console.log(CLI_Info.BundleSize.Compression('Brotli Compression', brotliRatio));

    console.log(CLI_Info.BundleSize.Separator('-', 30));

    consoleInfo(CLI_Info.BundleSize.Breakdown);
    const sortedExtensions = Array.from(stats.filesByExtension.entries()).sort(
      (a, b) => (stats.sizeByExtension.get(b[0]) || 0) - (stats.sizeByExtension.get(a[0]) || 0),
    );

    sortedExtensions.forEach(([ext, count]) => {
      const size = stats.sizeByExtension.get(ext) || 0;
      const percentage = ((size / stats.totalRawSize) * 100).toFixed(1);
      const displayExt = ext === 'no-ext' ? '(no extension)' : ext;
      console.log(CLI_Info.BundleSize.DisplayExt(displayExt, count, this.formatBytes(size), percentage));
    });

    console.log(CLI_Info.BundleSize.Separator('-', 30));
  }

  private processDir(pathToDir: string) {
    const absolutePath = this.getAbsolutePathToDir(pathToDir);

    if (!absolutePath) return;

    consoleInfo(CLI_Info.BundleSize.Scanning);
    this.scanDirectoryForFiles(absolutePath);

    if (this.fileMap.size === 0) {
      consoleInfo(CLI_Info.BundleSize.EmptyDir);
      return;
    }

    const stats = this.calculateBundleStats();
    this.printBundleReport(stats, absolutePath);
  }
}
