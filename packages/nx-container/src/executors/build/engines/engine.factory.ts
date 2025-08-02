import { Docker } from './docker/docker.engine';
import { EngineAdapter } from './engine-adapter';
import { Podman } from './podman/podman.engine';

export class EngineFactory {
  public static create(name: string): EngineAdapter {
    switch (name) {
      case 'docker':
        return new Docker();
      case 'podman':
        return new Podman();
      default:
        throw new Error('Unsupported Container Engine');
    }
  }
}
