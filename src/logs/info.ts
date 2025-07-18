export const CLI_Info = {
  FileAdded: (file: string) => `File [${file}] has successfully added!`,
  WorkerForFileEnded: (file: string) => `Worker for file [${file}] has finished processing.`,
  YourQuestion: (question: string) => `📨 Sending question [${question}]...`,
  StartConverting: (file: string) => `Start Converting [${file}]`,
  SuccessConverting: (file: string) => `File has successfully been converted [${file}]`,
  DeleteExisting: (file: string) => `Deleting existing file [${file}]`,
};
