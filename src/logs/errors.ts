export const CLI_Errors = {
  UnsupportedFileFormat: (arg: string, supported: string) =>
    `Unsupported file format [${arg}]. Please use a supported extension (e.g. ${supported}).`,
  MissingInputFile: 'No input file specified. Please provide a file path.',
  InvalidArguments: 'Invalid command-line arguments provided.',
  DeepseekEmptyMessage:
    'Cannot send an empty message to Deepseek. Please provide input using the -m="your message" flag.',
  GeminiEmptyMessage: 'Cannot send an empty message to Gemini. Please provide input using the -m="your message" flag.',
  GeminiInitializationError:
    'Gemini initialization failed. Please check your environment variables (e.g., GOOGLE_API_KEY).',
  GeminiCompletionError: (err: unknown) => `Gemini failed to generate a response. Error: ${String(err)}`,
  ConvertImageEmptyPath: 'No image path provided. Please use the -p="path/to/image.png" flag.',
  ConvertImageNotImage: 'The provided file format is not supported. Supported formats: .png, .jpg, .jpeg, .webp.',
  ConvertSameExts: 'The target format is the same as the input format. Please choose a different extension.',
};
