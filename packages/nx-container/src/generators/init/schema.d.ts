export interface Schema {
  /**
   * The default container engine to be used when building images
   * @default docker
   */
  defaultEngine?: 'docker' | 'podman';
  /**
   * The default container registry to be used when building images
   * @default docker.io
   */
  defaultRegistry?: string;
}
