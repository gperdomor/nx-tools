import { GitReferenceType } from '../enums/git.enum';

export interface GitReference {
  type: GitReferenceType;
  name: string;
}

export interface Git {
  repository: string;
  sha: string;
  reference: GitReference;
}
