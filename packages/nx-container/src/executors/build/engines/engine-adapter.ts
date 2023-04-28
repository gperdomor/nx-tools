import { ExecutorContext } from '@nx/devkit';
import { Inputs } from '../context';

export abstract class EngineAdapter {
  abstract getCommand(args: string[]): { command: string; args: string[] };
  abstract initialize(inputs: Inputs, ctx?: ExecutorContext): Promise<void>;
  abstract finalize(inputs: Inputs, ctx?: ExecutorContext): Promise<void>;
  abstract getImageID(): Promise<string>;
  abstract getMetadata(): Promise<string>;
  abstract getDigest(metadata: string): Promise<string>;
  abstract getArgs(inputs: Inputs, defaultContext: string): Promise<string[]>;
}
