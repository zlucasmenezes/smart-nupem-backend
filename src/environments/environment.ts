import * as dev from './environment.dev';
import * as hmg from './environment.hmg';

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
    name: 'smart-nupem-backend',
    version: '0.0.3'
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
}
