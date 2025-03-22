import { Request, Response } from "express";
import PedidoInput from "../interfaces/Input/PedidoInput";
import PedidoOutput from "../interfaces/Outputs/PedidoOutput";
import pedidoService from "../services/pedidoService";

async function create(req: Request, res: Response) {
  const pedidoInput: PedidoInput = req.body;

  try {
    const pedidoOutput: PedidoOutput = await pedidoService.create(pedidoInput);
    res.status(201).json(pedidoOutput);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o pedido", descricao: error });
  }
}

async function getAll(req:Request, rep: Response) {
    
}

export default {
  create,
  getAll
};
