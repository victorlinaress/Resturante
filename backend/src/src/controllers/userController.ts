import { prisma } from "../../prisma/prismaClient.js";
import { NextFunction, Request, Response } from 'express';
import UserInput from '../interfaces/Input/UserInput';
import UserOutput from '../interfaces/Outputs/UserOutput';
import userService from "../services/userService";
import admin from "../../firebaseAdmin.js"; 
import User from '../models/User';
import NotFoundError from "../errors/NotFoundError";


declare global {
    namespace Express {
        interface Request {
            user?: User; 
        }
    }
}


async function create(req: Request<{}, {}, UserInput>, res: Response) {
    const userInput: UserInput = req.body;

    try {  
      const userOutput: UserOutput = await userService.create(userInput);
  
      res.status(201).json(userOutput);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário', descricao: error });
    }
};


async function getAll(req: Request, res: Response) {
    try {
        const usersOutput: UserOutput[] = await userService.getAll();

        res.status(200).json(usersOutput);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(error.statusCode).json({ error: 'Usuários não encontrados', descricao: error });
        }else{
            res.status(500).json({ error: 'Erro ao buscar usuários', descricao: error });
        }
    }
}

async function getById(req: Request, res: Response){
    const { id } = req.params;

    try {
        const userOutput: UserOutput = await userService.getById(Number(id));

        res.status(200).json(userOutput);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(error.statusCode).json({ error: 'Usuário não encontrado', descricao: error });
        }else{
            res.status(500).json({ error: 'Erro ao buscar usuário', descricao: error });
        }
    }
}

async function getByUid(req: Request, res: Response){
    const { uid } = req.params;

    try {
        const userOutput: UserOutput = await userService.getByUid(uid);

        res.status(200).json(userOutput);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(error.statusCode).json({ error: 'Usuário não encontrado', descricao: error });
        }else{
            res.status(500).json({ error: 'Erro ao buscar usuário', descricao: error });
        }
    }
}

async function update(req: Request<{ id: string }, {}, UserInput>, res: Response) {
    const { id } = req.params;
    const userInput: UserInput = req.body;

    try {
        const userOutput: UserOutput = await userService.update(Number(id), userInput);

        res.status(200).json(userOutput);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', descricao: error });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
        await userService.remove(Number(id));

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário', descricao: error });
    }
}

async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token não fornecido ou inválido" });
        return;
    }

    const idToken = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken); // Verifica o token
        req.user = decodedToken; // Adiciona informações do usuário ao objeto `req`
        next(); // Prossegue para a próxima rota
    } catch (error) {
        res.status(403).json({ message: "Token inválido", error });
        return;
    }
}

export default { 
    create, 
    getAll, 
    getById, 
    getByUid,
    update, 
    remove,
    verifyFirebaseToken
};