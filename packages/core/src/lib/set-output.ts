import { issueCommand } from '@actions/core/lib/command';

export function setOutput(name: string, value: any): void {
  issueCommand('set-output', { name }, value);
}
