export const enum RootDataTypes {
  Message = 'Message',
  Version = 'Version',
  Path = 'Path',
  FileExtension = 'FileExtension',
}

export type TRootMap = Map<RootDataTypes, string[]>;
