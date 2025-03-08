import PedidoInput from "../interfaces/Input/PedidoInput";
import PedidoOutput from "../interfaces/Outputs/PedidoOutput";
import prisma from "../prisma/prismaClient"; // Certificando que o Prisma está importado
import userService from "./userService";
import restauranteService from "./restauranteService";

// Função para criar um novo pedido
async function create(pedidoInput: PedidoInput): Promise<PedidoOutput> {
    // Criando um novo pedido no banco de dados com as informações fornecidas em pedidoInput
    const pedido = await prisma.pedidos.create({
        data: pedidoInput
    });

    // Formando o objeto PedidoOutput com as informações do pedido, usuário e restaurante
    const pedidoOutput: PedidoOutput = { // Está criando um único objeto, usando a interface
        id: pedido.id, // ID do pedido
        userOutput: await userService.getById(pedido.idUser), // Buscando os dados do usuário associado ao pedido
        restauranteOutput: await restauranteService.getById(pedido.idRestaurante), // Buscando os dados do restaurante associado ao pedido
        data: pedido.data // A data do pedido
    };

    // Retorna o objeto PedidoOutput com os dados completos do pedido
    return pedidoOutput;
}

// Função para buscar todos os pedidos de um usuário
async function getAllForUsers(idUser: number): Promise<PedidoOutput[]> {
    // Buscando todos os pedidos do banco de dados para o usuário com idUser específico e que tenham status verdadeiro
    const pedido: Pedido[] = await prisma.pedidos.findMany({
        where: { status: true, idUser: idUser },
    });

    // Verificando se não há pedidos encontrados para o usuário
    if (pedido.length === 0) {
        // Lançando um erro caso não haja pedidos para esse usuário
        throw new Error("Nenhum pedido encontrado");
    }

    // Usando Promise.all para aguardar que as Promises de todos os pedidos sejam resolvidas
    const pedidosOutput: PedidoOutput[] = await Promise.all(pedido.map(async (pedido) => {
        return { // Cria um array de objetos, um para cada pedido
            id: pedido.id, // ID do pedido
            userOutput: await userService.getById(pedido.idUser), // Buscando os dados do usuário associado ao pedido
            restauranteOutput: await restauranteService.getById(pedido.idRestaurante), // Buscando os dados do restaurante associado ao pedido
            data: pedido.data // A data do pedido
        };
    }));

    // Retorna um array de objetos PedidoOutput com os dados de todos os pedidos encontrados
    return pedidosOutput;
}

// Função para buscar um pedido por ID
async function getById(id: number): Promise<PedidoOutput> {
    const pedido: Pedido = await prisma.pedidos.findUnique({
        where: { id: id }
    });

    // Verificando se o pedido não foi encontrado
    if (!pedido) {
        throw new Error("Pedido não encontrado");
    }

    // Formando o objeto PedidoOutput com os dados completos do pedido
    const pedidoOutput: PedidoOutput = {
        id: pedido.id,
        userOutput: await userService.getById(pedido.idUser),
        restauranteOutput: await restauranteService.getById(pedido.idRestaurante),
        data: pedido.data
    };

    return pedidoOutput;
}

// Função para atualizar um pedido
async function update(id: number, pedidoInput: PedidoInput): Promise<PedidoOutput> {
    // Atualizando um pedido no banco de dados com os dados fornecidos em pedidoInput
    const pedido: Pedido = await prisma.pedidos.update({
        where: { id: id },
        data: pedidoInput
    });

    // Formando o objeto PedidoOutput com os dados atualizados do pedido
    const pedidoOutput: PedidoOutput = {
        id: pedido.id,
        userOutput: await userService.getById(pedido.idUser),
        restauranteOutput: await restauranteService.getById(pedido.idRestaurante),
        data: pedido.data
    };

    return pedidoOutput;
}

// Função para remover um pedido (marcando o status como false)
async function remove(id: number): Promise<void> {
    await prisma.pedidos.update({
        where: { id: id },
        data: { status: false }
    });
}

// Exportando as funções para uso em outros módulos
export default {
    create,
    getAllForUsers,
    getById,
    update,
    remove
};
