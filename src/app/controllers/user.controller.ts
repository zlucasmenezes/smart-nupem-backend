import { Request, Response } from 'express';
import User from '../schemas/user.schema';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import { SocketIO } from '../socket-io';
import { EmailService } from '../services/email.service';
import { EmailTemplate } from '../utils/email-template';
import { environment } from '../../environments/environment';

class UserController {

    public async signup(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const user = new User(request.body);
            const createdUser = await user.save();

            SocketIO.broadcast('user_created', user);

            EmailService.send(environment.smtp.email.welcome, [createdUser.email], 'Welcome to Monica', EmailTemplate.welcome(createdUser.fullName))
            .catch(console.error);

            return response.status(201).send(patternResponse(createdUser, 'User created'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }

    public async login(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const encodedToken = await User.generateAuthToken(request.body.username, request.body.password);
            return response.status(200).send(patternResponse(encodedToken, 'User authenticated'));
        }
        catch (error) {
            return response.status(401).send(patternError(error, error.message));
        }
    }

    public async find(_: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const users = await User.find();
            return response.status(200).send(patternResponse(users));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }

    public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const user = await User.findById(request.params.id);
            return response.status(200).send(patternResponse(user));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }

    public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const user = await User.findById(request.params.id);
            const updatedUser = request.body;

            if (!user) { return response.status(404).send(patternError(undefined, 'User not found')); }

            user.firstName = updatedUser.firstName;
            user.lastName = updatedUser.lastName;
            user.email = updatedUser.email;
            const updated = await user.save();

            return response.status(200).send(patternResponse(updated, 'User updated'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }

    public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const deleted = await User.deleteOne({ _id: request.params.id });

            return response.status(200).send(patternResponse(deleted, 'User deleted'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }
}

export default new UserController();
