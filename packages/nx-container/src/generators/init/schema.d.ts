export interface InitGeneratorSchema {
  /**
   * The name of the project to add the Container setup to.
   */
  project: string;
  /**
   * Provide the container engine to be used.
   */
  engine?: 'docker' | 'podman' | 'kaniko';
  /**
   * Which type of app you are building?.
   */
  template?: 'empty' | 'nest' | 'next' | 'nginx';
  /**
   * Skips formatting the workspace after the generator completes.
   */
  skipFormat?: boolean;
}
