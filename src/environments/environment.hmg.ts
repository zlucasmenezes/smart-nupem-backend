import { IEnvironmentConfiguration } from './environment';

export const environmentConfiguration: IEnvironmentConfiguration = {
  database: {
    host: 'localhost',
    port: 27017,
    db: 'monica-hmg',
    user: 'hmg',
    pwd: 'hmg'
  },
  port: 3001,
  authentication: {
    key: 'HMG_SECRET_THIS_SHOULD_BE_LONGER',
    board: 'HMG_SECRET_THIS_SHOULD_BE_LONGER_TOO',
    options: {
      expiresIn: 7 * 24 * 3600
    }
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'user',
      pass: 'password',
    },
    email: {
      default: '"NO REPLY" <noreply@monica.com>'
    }
  }
};
