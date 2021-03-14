import { Secret, SignOptions } from 'jsonwebtoken';
import * as dev from './environment.dev';
import * as test from './environment.test';

let environmentConfiguration: IEnvironmentConfiguration;

switch (process.env.environment) {
  case 'test':
    environmentConfiguration = test.environmentConfiguration;
    break;
  default:
    environmentConfiguration = dev.environmentConfiguration;
    break;
}

export const environment: IEnvironment = {
  ...environmentConfiguration,
  ...{
    name: 'monica-backend',
    version: '0.0.26',
  },
};

export interface IEnvironment extends IEnvironmentConfiguration {
  name: string;
  version: string;
}

export interface IEnvironmentConfiguration {
  database: {
    prefix: string;
    host: string;
    port?: number;
    db: string;
    user: string;
    pwd: string;
    options: string;
  };
  port: number;
  authentication: {
    key: Secret;
    board: Secret;
    options: SignOptions;
  };
  smtp: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
    email: {
      default: string;
    };
  };
}
