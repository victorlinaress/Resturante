import ItemPedidoInput from "../interfaces/Input/ItemPedidoInput";
import ItemPedidoOutput from "../interfaces/Outputs/ItemPedidoOutput";
import NotFoundError from "../errors/NotFoundError";
import itemCardapioService from "./itemCardapioService";
import pedidoService from "./pedidoService";
import prisma from "../prisma/prismaClient";

// criar um novo item de pedido
async function create(itemPedidoInput: ItemPedidoInput): Promise<ItemPedidoOutput> {
  const itemPedido: ItemPedido = await prisma.itens_pedido.create({
    data: itemPedidoInput,
  });

  return {
    id: itemPedido.id,
    pedidoOutput: await pedidoService.getById(itemPedido.idPedido),
    itemCardapioOutput: await itemCardapioService.getById(itemPedido.idItemCardapio),
    quantidade: itemPedido.quantidade,
  };
}

// buscar um item de pedido pelo ID
async function getById(id: number): Promise<ItemPedidoOutput> {
  const itemPedido = await prisma.itens_pedido.findUnique({
    where: { id: id, status: true },
  });

  if (!itemPedido) {
    throw new NotFoundError("Item de pedido não encontrado");
  }

  return {
    id: itemPedido.id,
    pedidoOutput: await pedidoService.getById(itemPedido.idPedido),
    itemCardapioOutput: await itemCardapioService.getById(itemPedido.idItemCardapio),
    quantidade: itemPedido.quantidade,
  };
}

// buscar todos os itens de um pedido específico
async function getAllForPedido(idPedido: number): Promise<ItemPedidoOutput[]> {
  console.log(`service: ${idPedido}`);

  const itensPedido: ItemPedido[] = await prisma.itens_pedido.findMany({
    where: {
      status: { not: false },
      idPedido: idPedido,
    },
  });

  if (itensPedido.length === 0) {
    throw new NotFoundError();
  }

  return await Promise.all(
    itensPedido.map(async (itemPedido) => ({
      id: itemPedido.id,
      pedidoOutput: await pedidoService.getById(itemPedido.idPedido),
      itemCardapioOutput: await itemCardapioService.getById(itemPedido.idItemCardapio),
      quantidade: itemPedido.quantidade,
    }))
  );
}

// atualizar um item do pedido
async function update(id: number, itemPedidoInput: ItemPedidoInput): Promise<ItemPedidoOutput> {
  const itemPedido: ItemPedido = await prisma.itens_pedido.update({
    where: { id: id, status: true },
    data: itemPedidoInput,
  });

  return {
    id: itemPedido.id,
    pedidoOutput: await pedidoService.getById(itemPedido.idPedido),
    itemCardapioOutput: await itemCardapioService.getById(itemPedido.idItemCardapio),
    quantidade: itemPedido.quantidade,
  };
}

// remover um item do pedido
async function remove(id: number): Promise<void> {
  await prisma.itens_pedido.update({
    where: { id: id },
    data: { status: false },
  });
}

export default {
  create,
  getById,
  getAllForPedido,
  update,
  remove,
};
