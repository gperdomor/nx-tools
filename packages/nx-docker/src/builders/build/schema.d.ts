import { JsonObject } from '@angular-devkit/core';
import { Inputs } from './context';

export interface DockerBuilderInputsSchema extends JsonObject, Partial<Inputs> {} // eslint-disable-line
