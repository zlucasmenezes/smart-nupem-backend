import { Request, Response } from 'express';
import User from '../schemas/user.schema';

class UserController {

    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const user = new User(request.body);
            const createdUser = await user.save();

            return response.status(201).send(createdUser);
        }
        catch (error) {
            return response.status(500).send(error.toString());
        }
    }

    public async find(_: Request, response: Response): Promise<Response> {
        try {
            const users = await User.find();
            return response.status(200).send(users);
        }
        catch (error) {
            return response.status(500).send(error.toString());
        }
    }

    public async findOne(request: Request, response: Response): Promise<Response> {
        try {
            const user = await User.findById(request.params.id);
            return response.status(200).send(user);
        }
        catch (error) {
            return response.status(500).send(error.toString());
        }
    }

    public async update(request: Request, response: Response): Promise<Response> {
        try {
            const user = await User.findById(request.params.id);
            const updatedUser = request.body;

            let updated;
            if (user) {
                user.firstName = updatedUser.firstName;
                user.lastName = updatedUser.lastName;
                user.email = updatedUser.email;
                user.username = updatedUser.username;
                user.password = updatedUser.password;
                updated = await user.save();
            }

            return response.status(200).send(updated);
        }
        catch (error) {
            return response.status(500).send(error.toString());
        }
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        try {
            const deleted = await User.deleteOne({ _id: request.params.id });
            return response.status(200).send(deleted);
        }
        catch (error) {
            return response.status(500).send(error.toString());
        }
    }
}

export default new UserController();
