import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

class App {

  private app: express.Application;

  constructor(private port = 3000) {
    this.app = express();
    this.app.disable('x-powered-by');

    this.middlewars();
    this.routes();
  }

  public async start(): Promise<void> {
    await this.database();

    const server = this.app.listen(this.port);

    server.on('listening', () => console.log(`[APP] smart-nupem-backend listening at http://localhost:${this.port}`));
    server.on('error', (e: Error) => console.error(`[APP] ${e}`));
  }

  private middlewars(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(): void {
    this.app.get('/', (_, res) => {
      res.send('Hello World!');
    });
  }

  private async database(): Promise<boolean> {

    mongoose.connection.on('disconnected', () => console.error(`[MONGODB] Can't connect to database`));
    mongoose.connection.on('connected', () => console.warn('[MONGODB] Connected to database'));
    mongoose.connection.on('connecting', () => console.info('[MONGODB] Connecting to database'));

    const connect = async (attempt: number = 1, maximumNumberOfAttempts: number = Infinity): Promise<boolean > => {
      try {
        await mongoose.connect('mongodb://dev:dev@localhost:27017/smart-nupem-dev?gssapiServiceName=mongodb', {
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
