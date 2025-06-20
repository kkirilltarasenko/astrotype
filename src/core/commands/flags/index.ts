class Flags {
  private readonly version = '1.0.0';
  executedFlags: string[] = [];

  constructor(args: string[]) {
    this.executedFlags = args;
  }

  getFlags() {
    return this.executedFlags.join(',');
  }

  getVersion() {
    return this.version;
  }
}

export default Flags;
