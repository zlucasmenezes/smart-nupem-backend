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
  authentication: {
    key: 'DEV_SECRET_THIS_SHOULD_BE_LONGER',
    options: {
      expiresIn: 7 * 24 * 3600
    }
  }
};
