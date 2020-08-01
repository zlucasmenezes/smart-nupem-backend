import * as dev from './environment.dev';
import * as hmg from './environment.hmg';
import { Secret, SignOptions } from 'jsonwebtoken';

let environmentConfiguration: IEnvironmentConfiguration;

switch (process.env.environment) {
  case 'hmg':
    environmentConfiguration = hmg.environmentConfiguration;
    break;
  default:
    environmentConfiguration = dev.environmentConfiguration;
    break;
}

export const environment: IEnvironment = {
  ...environmentConfiguration,
  ...{
    name: 'monica-backend',
    version: '0.0.15'
  }
};

export interface IEnvironment extends IEnvironmentConfiguration {
  name: string;
  version: string;
}

export interface IEnvironmentConfiguration {
  database: {
    host: string,
    port: number,
    db: string,
    user: string,
    pwd: string
  };
  port: number;
  authentication: {
    key: Secret,
    board: Secret,
    options: SignOptions,
  };
  smtp: {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string,
    },
    email: {
      default: string
    }
  };
}
