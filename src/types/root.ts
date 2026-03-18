export const enum RootDataTypes {
  Message = 'Message',
  Version = 'Version',
  Path = 'Path',
  FileExtension = 'FileExtension',
  Help = 'Help',
  Quality = 'Quality',
}

export type TRootMap = Map<RootDataTypes, string[]>;
