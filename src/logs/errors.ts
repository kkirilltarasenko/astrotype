export const CLI_Errors = {
  UnsupportedFileFormat: (arg: string) =>
    `Unsupported file format [${arg}]. Please use a supported extension (e.g. .yaml).`,
  MissingInputFile: 'No input file specified. Please provide a file path.',
  InvalidArguments: 'Invalid command-line arguments provided.',
};
