import { Args, Command, Flags } from '@oclif/core';

export default class Hello extends Command {
  static override args = {
    person: Args.string({ description: 'Person to say hello to', required: true }),
  };
  static override description = 'Say hello';
  static override examples = [
    `<%= config.bin %> <%= command.id %> friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ];
  static override flags = {
    from: Flags.string({ char: 'f', description: 'Who is saying hello', required: true }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Hello);

    this.log(`hello ${args.person} from ${flags.from}! (./src/commands/hello/index.ts)`);
  }
}
