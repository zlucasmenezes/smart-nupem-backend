import { IEnvironmentConfiguration } from './environment';

export const environmentConfiguration: IEnvironmentConfiguration = {
  database: {
    host: 'localhost',
    port: 27017,
    db: 'smart-nupem-dev',
    user: 'dev',
    pwd: 'dev'
  },
  port: 3000,
};
