import { IBoard } from '../models/board.model';
import { IThingPopulated } from '../models/thing.model';
import { IUser } from '../models/user.model';

export class EmailTemplateUtils {

  public static welcome(user: IUser) {
    return `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

      <style>
        body {
          margin: 0;
          font-family: Roboto, "Helvetica Neue", sans-serif;
          color: #333333;
          cursor: default;
        }
        .header {
          background: linear-gradient(60deg, #ff8801, #fe500e);
          display: flex;
          justify-content: center;
        }
        .title {
          font-size: 40px;
          font-weight: 200;
          color: #f7f7f7;
          padding: 40px;
        }
        .body {
          padding: 20px;
        }
        .welcome {
          margin-bottom: 20px;
        }
        .message {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="title">
          <span>MONICA</span>
        </div>
      </div>

      <div class="body">
        <div class="welcome">Hi, ${user.fullName}!</div>
        <div class="message">Welcome to Monica.</div>
      </div>

    </body>
    </html>`;
  }

  public static boardCredentials(user: IUser, board: IBoard, thing: IThingPopulated) {
    return `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

      <style>
        body {
          margin: 0;
          font-family: Roboto, "Helvetica Neue", sans-serif;
          color: #333333;
          cursor: default;
        }
        .header {
          background: linear-gradient(60deg, #ff8801, #fe500e);
          display: flex;
          justify-content: center;
        }
        .title {
          font-size: 40px;
          font-weight: 200;
          color: #f7f7f7;
          padding: 40px;
        }
        .body {
          padding: 20px;
        }
        .welcome {
          margin-bottom: 20px;
        }
        .message {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="title">
          <span>MONICA</span>
        </div>
      </div>

      <div class="body">
        <div class="welcome">Hi, ${user.fullName}!</div>
        <div class="message">
          Here your board credentials for ${thing.name}. <br><br>
          board: ${board._id}<br>
          password: ${board.password}
        </div>
      </div>

    </body>
    </html>`;
  }

}
