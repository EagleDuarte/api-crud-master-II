import { Request, Response } from "express";
import { User } from "../models/user";
import { UserRepository } from "../database/repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* O controller de users abaixo possui quatro métodos assíncronos: 

O método list é responsável por listar todos os usuários e retorna um status 200 (sucesso) com uma mensagem informando 
que os usuários foram listados e os dados (result) dos usuários.

O método get é responsável por obter um usuário específico com base no id fornecido como parâmetro e retorna um status 200 (sucesso) 
com uma mensagem informando que o usuário foi obtido e os dados (result) do usuário.

O método create é responsável por criar um novo usuário com base no nome e senha fornecidos no corpo da solicitação 
(request body) e retorna um status 201 (criado) com uma mensagem informando que o usuário foi criado e os dados (result) do usuário.

O método update é responsável por atualizar os dados de um usuário com base no id fornecido como parâmetro e nas informações de nome 
e senha fornecidas no corpo da solicitação (request body) e retorna um status 200 (sucesso) com uma mensagem informando que o usuário 
foi atualizado, assim como seus dados (resultUpdate). */

export class UserController {
  public async list(req: Request, res: Response) {
    try {
      const repository = new UserRepository();
      const result = await repository.list();

      return res.status(200).send({
        ok: true,
        message: "User successfully listed",
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

      const repository = new UserRepository();
      const result = await repository.getId(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "O User não existe",
        });
      }

      const user = User.create(result.name, result.pass, result.id);

      return res.status(200).send({
        ok: true,
        message: "User successfully obtained",
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
      const { name, pass } = req.body;

      if (!name) {
        return res.status(400).send({
          ok: false,
          message: "Name not provided",
        });
      }

      if (!pass) {
        return res.status(400).send({
          ok: false,
          message: "pass not provided",
        });
      }

      // const hashPass = await bcrypt.hash(pass, 10);

      const user = new User(name, pass);

      const repository = new UserRepository();
      const result = await repository.create(user);

      return res.status(201).send({
        ok: true,
        message: "User successfully created",
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
      const { name, pass } = req.body;

      const repository = new UserRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "User não encontrado",
        });
      }

      const resultUpdate = repository.update(result, {
        name,
        pass,
      });

      return res.status(200).send({
        ok: true,
        message: "User atualizado com sucesso",
        data: resultUpdate,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { name, pass } = req.body;

      const repository = new UserRepository();
      const result = await repository.get(name);

      if (!name) {
        return res.status(400).send({
          ok: false,
          message: "Name or Pass not provided",
        });
      }

      // if (result) {
      //   const verifyPass = await bcrypt.compare(pass, result?.pass);
      //   console.log(verifyPass);
      // }

      if (!pass) {
        return res.status(400).send({
          ok: false,
          message: "Name or pass not provided",
        });

        //   const token = jwt.sign({ id: result.id }, process.env.JWT_PASS ?? "", {
        //     expiresIn: "8h",
        //   });

        //   const { pass: _, ...userLogin } = result;
        //   console.log(result);

        //   return res.json({
        //     ok: true,
        //     user: userLogin,
        //     token: token,
        //     message: "Successfully",
        //   });
      }
      return res.status(201).send({
        ok: true,
        message: "Successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: "Instabilidade no servidor",
        error: error.toString(),
      });
    }
  }
}
