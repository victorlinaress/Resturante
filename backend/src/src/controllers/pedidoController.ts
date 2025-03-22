import { Request, Response } from "express";
import PedidoInput from "../interfaces/Input/PedidoInput";
import pedidoService from "../services/pedidoService";
import PedidoOutput from "../interfaces/Outputs/PedidoOutput";
import NotFoundError from "../errors/NotFoundError";

async function create(req: Request, res: Response) {
  const pedidoInput: PedidoInput = req.body;

  try {
    const pedidoOutput: PedidoOutput = await pedidoService.create(pedidoInput);
    res.status(201).json(pedidoOutput);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o pedido", descricao: error });
  }
}

async function getAllForUsers(req: Request, res: Response) {
  const { idUser } = req.params;

  try {
    const pedidoOutput: PedidoOutput[] = await pedidoService.getAllForUsers(Number(idUser));
    res.status(200).json(pedidoOutput);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: "Pedidos não encontrados", descricao: error });
    } else {
      res.status(500).json({ error: "Erro ao buscar pedidos", descricao: error });
    }
  }
}

async function getById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const pedidoOutput: PedidoOutput = await pedidoService.getById(Number(id));
    res.status(200).json(pedidoOutput);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: "Pedido não encontrado", descricao: error });
    } else {
      res.status(500).json({ error: "Erro ao buscar pedido", descricao: error });
    }
  }
}

async function update(req: Request, res: Response) {
  const { id } = req.params;
  const pedidoInput: PedidoInput = req.body;

  try {
    const pedidoOutput: PedidoOutput = await pedidoService.update(Number(id), pedidoInput);
    res.status(200).json(pedidoOutput);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o pedido", descricao: error });
  }
}

async function remove(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await pedidoService.remove(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar pedido", descricao: error });
  }
}

export default {
  create,
  getAllForUsers,
  getById,
  update,
  remove, 
};
