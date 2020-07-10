import { Request, Response } from 'express';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import Project from '../schemas/project.schema';

class ProjectController {

    public async create(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const project = new Project({ ...request.body, admin: request.token.userId });
        const createdProject = await project.save();

        return response.status(201).send(patternResponse(createdProject, 'Project created'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async find(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const projects = await Project.findByUserAndPopulate(request.token.userId);
        return response.status(200).send(patternResponse(projects));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const project = await Project.findByIdAndPopulate(request.params.id);
        return response.status(200).send(patternResponse(project));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const project = await Project.findById(request.params.id);
        const updatedProject = request.body;

        if (!project) { return response.status(404).send(patternError(undefined, 'Project not found')); }

        project.name = updatedProject.name;
        project.description = updatedProject.description;
        project.privacy = updatedProject.privacy;
        project.users = updatedProject.users;
        const updated = await project.save();

        return response.status(200).send(patternResponse(updated, 'Project updated'));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async delete(request: Request, response: Response<IResponsePattern>): Promise<Response> {
        try {
            const deleted = await Project.deleteOne({ _id: request.params.id });

            return response.status(200).send(patternResponse(deleted, 'Project deleted'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }
}

export default new ProjectController();
