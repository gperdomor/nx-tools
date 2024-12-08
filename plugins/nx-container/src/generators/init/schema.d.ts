export interface Schema {
  /**
   * Provide the default container engine to be used.
   */
  defaultEngine?: 'docker' | 'podman' | 'kaniko';
  defaultRegistry?: string;
}
