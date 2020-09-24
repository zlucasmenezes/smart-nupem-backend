import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import mongoose from 'mongoose';
import { environment, IEnvironment as Environment } from '../environments/environment';
import { IRouteConfig, routes } from './routes/routes';
import { EmailService } from './services/email.service';
import { SocketIO } from './socket-io';

class App {
  private app: Application;
  public environment: Environment = environment;

  constructor() {
    this.app = express();
    this.app.disable('x-powered-by');

    this.middleware();
    this.routes();
  }

  public async start(): Promise<Server> {
    await this.database();

    const server = this.app.listen(this.environment.port);

    server.on('listening', () =>
      console.log(`[APP] ${this.environment.name} v${this.environment.version} listening at http://localhost:${this.environment.port}`)
    );
    server.on('error', (e: Error) => console.error(`[APP] ${e}`));

    SocketIO.start(server);

    EmailService.start();

    return server;
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(): void {
    routes.forEach((route: IRouteConfig) => {
      this.app.use(route.routePath, route.childRoutes);
    });
  }

  private async database(): Promise<boolean> {
    mongoose.connection.on('disconnected', () => console.error(`[MONGODB] Can't connect to database`));
    mongoose.connection.on('connected', () => console.warn('[MONGODB] Connected to database'));
    mongoose.connection.on('connecting', () => console.info('[MONGODB] Connecting to database'));

    const connect = async (attempt: number = 1, maximumNumberOfAttempts: number = Infinity): Promise<boolean> => {
      try {
        await mongoose.connect(
          `${this.environment.database.prefix}://${this.environment.database.user}:${this.environment.database.pwd}@${
            this.environment.database.host
          }${this.environment.database.port ? ':' + this.environment.database.port : ''}/${this.environment.database.db}?${
            this.environment.database.options
          }`,
          {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            serverSelectionTimeoutMS: 5000,
          }
        );

        return Promise.resolve(true);
      } catch (e) {
        if (attempt === maximumNumberOfAttempts) {
          return Promise.resolve(false);
        }
        return await connect(attempt++);
      }
    };

    return await connect();
  }
}
export default new App();
