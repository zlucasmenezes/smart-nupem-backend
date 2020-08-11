import { Request, Response } from 'express';
import { IResponsePattern, patternResponse, patternError } from '../models/express.model';
import Project from '../schemas/project.schema';
import Thing from '../schemas/thing.schema';
import { IProjectPopulated } from '../models/project.model';

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
        const fetchedProjects = await Project.findByUserAndPopulate(request.token.userId);
        const projects: Partial<IProjectPopulated>[] = [];

        for (const fetchedProject of fetchedProjects) {
          const project: Partial<IProjectPopulated> = {
            _id: fetchedProject._id,
            name: fetchedProject.name,
            description: fetchedProject.description,
            admin: fetchedProject.admin,
            privacy: fetchedProject.privacy,
            users: fetchedProject.users,
            things: await Thing.findByProject(fetchedProject._id),
            createdAt: fetchedProject.createdAt,
            updatedAt: fetchedProject.updatedAt
          };
          projects.push(project);
        }

        return response.status(200).send(patternResponse(projects));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async findOne(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const project = await Project.findByIdAndPopulate(request.params.projectId);
        return response.status(200).send(patternResponse(project));
      }
      catch (error) {
        return response.status(500).send(patternError(error, error.message));
      }
    }

    public async update(request: Request, response: Response<IResponsePattern>): Promise<Response> {
      try {
        const project = await Project.findById(request.params.projectId);
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
            const deleted = await Project.deleteOne({ _id: request.params.projectId });

            return response.status(200).send(patternResponse(deleted, 'Project deleted'));
        }
        catch (error) {
            return response.status(500).send(patternError(error, error.message));
        }
    }
}

export default new ProjectController();
