import { Request, Response } from 'express';
import { environment } from '../../environments/environment';
import { IResponsePattern, patternError, patternResponse } from '../models/express.model';
import User from '../schemas/user.schema';
import { EmailService } from '../services/email.service';
import { EmailTemplateUtils } from '../utils/email-template-utils';

class UserController {
  public async signup(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const user = new User(request.body);
      const createdUser = await user.save();

      EmailService.send(
        environment.smtp.email.default,
        [createdUser.getEmail()],
        'Welcome to Monica',
        EmailTemplateUtils.welcome(createdUser)
      ).catch(console.error);

      return response.status(201).send(patternResponse(createdUser, 'User created'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async login(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const encodedToken = await User.generateAuthToken(request.body.username, request.body.password);
      return response.status(200).send(patternResponse(encodedToken, 'User authenticated'));
    } catch (error) {
      return response.status(401).send(patternError(error, error.message));
    }
  }

  public async find(_: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const users = await User.find();
      return response.status(200).send(patternResponse(users));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const user = await User.findById(request.params.userId);
      return response.status(200).send(patternResponse(user));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const user = await User.findById(request.params.userId);
      const updatedUser = request.body;

      if (!user) {
        return response.status(404).send(patternError(undefined, 'User not found'));
      }

      user.firstName = updatedUser.firstName;
      user.lastName = updatedUser.lastName;
      user.email = updatedUser.email;
      const updated = await user.save();

      return response.status(200).send(patternResponse(updated, 'User updated'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }

  public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
    try {
      const deleted = await User.deleteOne({ _id: request.params.userId });

      return response.status(200).send(patternResponse(deleted, 'User deleted'));
    } catch (error) {
      return response.status(500).send(patternError(error, error.message));
    }
  }
}

export default new UserController();
