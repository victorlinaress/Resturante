import { Request, Response } from "express";
import ItemPedidoInput from "../interfaces/Input/ItemPedidoInput";
import itemPedidoService from "../services/itemPedidoService";
import ItemPedidoOutput from "../interfaces/Outputs/ItemPedidoOutput";
import NotFoundError from "../errors/NotFoundError";
import ItemPedido from "../models/ItemPedido";

async function create(req: Request, res: Response) {
  const itemPedidoInput: ItemPedidoInput = req.body;

  try {
    const itemPedidoOutput: ItemPedidoOutput = await itemPedidoService.create(itemPedidoInput);
    res.status(201).json(itemPedidoOutput);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar item do pedido", descricao: error });
  }
}

async function getAllForPedido(req: Request, res: Response) {
  const { idPedido } = req.params;

  try {
    const itensPedido: ItemPedidoOutput[] = await itemPedidoService.getAllForPedido(Number(idPedido));
    res.status(200).json(itensPedido);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: "Item pedido não foi encontrado", descricao: error });
    } else {
      res.status(500).json({ error: "Erro ao buscar item pedido", descricao: error });
    }
  }
}

async function getById(req: Request, res: Response) {
  const { id } = req.params;
  
  try {
    const itemPedido: ItemPedidoOutput = await itemPedidoService.getById(Number(id));
    res.status(200).json(itemPedido);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: "Item pedido não encontrado", descricao: error });
    } else {
      res.status(500).json({ error: "Erro ao buscar o item do pedido", descricao: error });
    }
  }
}

export default {
  create,
  getAllForPedido,
  getById,
};
