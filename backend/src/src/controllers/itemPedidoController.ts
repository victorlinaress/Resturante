import { Request, Response } from "express";
import ItemPedidoInput from "../interfaces/Input/ItemPedidoInput"; // Corrigido aqui
import itemPedidoService from "../services/itemPedidoService";
import ItemPedidoOutput from "../interfaces/Outputs/ItemPedidoOutput";

async function create(req: Request, res: Response) {
  const itemPedidoInput: ItemPedidoInput = req.body;

  try {
    const itemPedidoOutput: ItemPedidoOutput = await itemPedidoService.create(
      itemPedidoInput
    );
    res.status(201).json(itemPedidoOutput);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar item do pedido", descricao: error });
  }
}

async function getAllForPedido(req:Request, rep:Response) {
  const {idPedido} = req.params
  
}

export default {
  create,
};
