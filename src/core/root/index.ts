import yargs from "yargs";

class Root {
  static showArgs() {
    console.log(yargs(process.argv.slice(2)).parse())
  }
}

export default Root;