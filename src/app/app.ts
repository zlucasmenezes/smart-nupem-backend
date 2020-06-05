import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { environment, IEnvironment as Environment } from '../environments/environment';
import { Server } from 'http';

class App {

  private app: express.Application;
  public environment: Environment = environment;

  constructor() {
    this.app = express();
    this.app.disable('x-powered-by');

    this.middlewars();
    this.routes();
  }

  public async start(): Promise<Server> {
    await this.database();

    const server = this.app.listen(this.environment.port);

    server.on('listening', () => console.log(`[APP] ${this.environment.name} v${this.environment.version} listening at http://localhost:${this.environment.port}`));
    server.on('error', (e: Error) => console.error(`[APP] ${e}`));

    return server;
  }

  private middlewars(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(): void {
    this.app.get('/', (_, res) => {
      res.send(`${process.env.environment}: ${this.environment.name} v${this.environment.version}`);
    });
  }

  private async database(): Promise<boolean> {

    mongoose.connection.on('disconnected', () => console.error(`[MONGODB] Can't connect to database`));
    mongoose.connection.on('connected', () => console.warn('[MONGODB] Connected to database'));
    mongoose.connection.on('connecting', () => console.info('[MONGODB] Connecting to database'));

    const connect = async (attempt: number = 1, maximumNumberOfAttempts: number = Infinity): Promise<boolean > => {
      try {
        await mongoose.connect(`mongodb://${this.environment.database.user}:${this.environment.database.pwd}@${this.environment.database.host}:${this.environment.database.port}/${this.environment.database.db}?gssapiServiceName=mongodb`, {
          useCreateIndex: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          serverSelectionTimeoutMS: 5000
        });

        return Promise.resolve(true);
      }
      catch (e) {
        if (attempt === maximumNumberOfAttempts) { return Promise.resolve(false); }
        return await connect(attempt++);
      }
    };

    return await connect();
  }

}
export default new App();
