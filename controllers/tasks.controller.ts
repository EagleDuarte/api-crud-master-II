import { Request, Response } from "express";
import { TasksRepository } from "../database/repositories/tasks.repository";
import { UserRepository } from "../database/repositories/user.repository";
import { Tasks } from "../models/tasks";
import { User } from "../models/user";

/* O controller de tarefas contém métodos para lidar com operações para listar tasks,
 obter uma task por ID, criar uma nova task, atualizar uma task existente, arquivar uma task e excluir uma task existente. */

export class TasksController {
  public async list(req: Request, res: Response) {
    try {
      const repository = new TasksRepository();
      const result = await repository.list();

      return res.status(200).send({
        ok: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Task not found",
        });
      }

      return res.status(200).send({
        ok: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { description, detail, idUser } = req.body;

      if (!description) {
        return res.status(400).send({
          ok: false,
          message: "Description not provided",
        });
      }

      if (!detail) {
        return res.status(400).send({
          ok: false,
          message: "Detail not provided",
        });
      }

      if (!idUser) {
        return res.status(400).send({
          ok: false,
          message: "User (ID) not found",
        });
      }

      const userRepository = new UserRepository();
      const userResult = await userRepository.getId(idUser);

      if (!userResult) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      const user = User.create(userResult.id, userResult.name, userResult.pass);

      const tasks = new Tasks(description, detail, user);

      const tasksRepository = new TasksRepository();
      const result = await tasksRepository.create(tasks);

      return res.status(201).send({
        ok: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description, detail, arquivada } = req.body;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Task não encontrada!",
        });
      }

      const resultUpdate = repository.update(result, {
        description,
        detail,
        arquivada,
      });

      return res.status(200).send({
        ok: true,
        message: "Task atualizado com sucesso",
        data: resultUpdate,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async arquivar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { arquivada } = req.body;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      const resultUpdate = repository.arquivar(result, {
        arquivada,
      });

      return res.status(200).send({
        ok: true,
        message: "Task updated sucessfuly",
        data: resultUpdate,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Task not found",
        });
      }

      await repository.delete(id);

      return res.status(200).send({
        ok: true,
        message: "Task successfully deleted",
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
}
