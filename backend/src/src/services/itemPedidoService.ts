import ItemPedidoInput from "../interfaces/Input/ItemPedidoInput";
import ItemPedidoOutput from "../interfaces/Outputs/ItemPedidoOutput";

async function create(itemPedidoInput: ItemPedidoInput): Promise<ItemPedidoOutput> {
    const itemPedido: ItemPedido = await prisma.itens_pedido.create({
        data: itemPedidoInput,
    });

    return {
        id: itemPedido.id,
        idPedido: itemPedido.idPedido,
        idItemCardapio: itemPedido.idItemCardapio,
        quantidade: itemPedido.quantidade,
        subtotal: itemPedido.subtotal,
    };
}
