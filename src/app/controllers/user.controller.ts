import { Request, Response } from 'express';
import User from '../schemas/user.schema';

class UserController {

    public async signup(request: Request, response: Response): Promise<Response> {
        try {
            const user = new User(request.body);
            const createdUser = await user.save();

            return response.status(201).send(createdUser);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }

    public async login(request: Request, response: Response): Promise<Response> {
        try {
            const token = await User.generateAuthToken(request.body.username, request.body.password);
            return response.status(200).send({ token });
        }
        catch (error) {
            return response.status(401).send(null);
        }
    }

    public async find(_: Request, response: Response): Promise<Response> {
        try {
            const users = await User.find();
            return response.status(200).send(users);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }

    public async findOne(request: Request, response: Response): Promise<Response> {
        try {
            const user = await User.findById(request.params.id);
            return response.status(200).send(user);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }

    public async update(request: Request, response: Response): Promise<Response> {
        try {
            if (request.token.userId !== request.params.id) { return response.status(401).send('Not authorized!'); }

            const user = await User.findById(request.params.id);
            const updatedUser = request.body;

            if (!user) { return response.status(404).send(null); }

            user.firstName = updatedUser.firstName;
            user.lastName = updatedUser.lastName;
            user.email = updatedUser.email;
            const updated = await user.save();

            return response.status(200).send(updated);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        try {
            const deleted = await User.deleteOne({ _id: request.params.id });
            return response.status(200).send(deleted);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }
}

export default new UserController();
