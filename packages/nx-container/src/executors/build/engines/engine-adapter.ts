import { ExecutorContext } from '@nx/devkit';
import { Inputs } from '../context';

export abstract class EngineAdapter {
  abstract getCommand(args: string[]): { command: string; args: string[] };
  abstract initialize(inputs: Inputs, ctx?: ExecutorContext): Promise<void>;
  abstract finalize(inputs: Inputs, ctx?: ExecutorContext): Promise<void>;
  abstract getImageID(): Promise<string | undefined>;
  abstract getMetadata(): Promise<string | undefined>;
  abstract getDigest(metadata: string | undefined): Promise<string | undefined>;
  abstract getArgs(inputs: Inputs, defaultContext: string): Promise<string[]>;

  getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}
