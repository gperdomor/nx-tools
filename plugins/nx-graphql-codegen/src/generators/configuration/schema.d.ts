export interface ConfigurationGeneratorSchema {
  project: string;
  directory?: string;
  configFileType: string;
  schema: string;
  skipFormat: boolean;
  skipPackageJson: boolean;
}
