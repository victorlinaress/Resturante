import ItemCardapioInput from "../interfaces/Input/ItemCardapioInput";
import ItemCardapioOutput from "../interfaces/Outputs/ItemCardapioOutput";
import itemCardapio from "../models/ItemCardapio";
import NotFoundError from "../errors/NotFoundError";
import restauranteService from "../services/restauranteService"; // Import do service de restaurante
const prisma = require("../../prisma/prismaClient");

async function create(itemCardapioInput: ItemCardapioInput): Promise<ItemCardapioOutput> {//criar no banco de dados
    // Cria o item de cardápio no banco de dados
    const itemCardapio = await prisma.itens_cardapio.create({
        data: itemCardapioInput,
    });

    return {
        id: itemCardapio.id,
        nome: itemCardapio.nome,
        descricao: itemCardapio.descricao,
        preco: itemCardapio.preco,
        fotoUrl: itemCardapio.fotoUrl,
        idRestaurante: itemCardapio.idRestaurante,
    };
}

async function getAllForRestaurant(idRestaurant: number): Promise<ItemCardapioOutput[]> {//buscar todos os itens
    const itensCardapio: itemCardapio[] = await prisma.itens_cardapio.findMany({
        where: { status: true, idRestaurant: idRestaurant },
    });

    if (itensCardapio.length === 0) {
        throw new NotFoundError();
    }

    // formata os itens retornando detalhes do restaurante
    return Promise.all(
        itensCardapio.map(async (itemCardapio) => {
            const restauranteOutput = await restauranteService.getById(itemCardapio.idRestaurante);
            return {
                id: itemCardapio.id,
                restauranteOutput, // Detalhes do restaurante
                nome: itemCardapio.nome,
                descricao: itemCardapio.descricao,
                preco: itemCardapio.preco,
                fotoUrl: itemCardapio.fotoUrl,
            };
        })
    );
}

async function getById(id: number): Promise<ItemCardapioOutput> {//busca o item pelo ID
    const itemCardapio: itemCardapio | null = await prisma.itens_cardapio.findUnique({
        where: { id, status: true },
    });

    if (!itemCardapio) {
        throw new NotFoundError();
    }

    return {
        id: itemCardapio.id,
        restauranteOutput: await restauranteService.getById(itemCardapio.idRestaurante),
        nome: itemCardapio.nome,
        descricao: itemCardapio.descricao,
        preco: itemCardapio.preco,
        fotoUrl: itemCardapio.fotoUrl,
    };
}

async function remove(id: number): Promise<void> {
    await prisma.itens_cardapio.update({
        where: { id },
        data: { status: false },
    });
}

export default { 
    create,
    getAllForRestaurant,
    getById,
    remove
};
