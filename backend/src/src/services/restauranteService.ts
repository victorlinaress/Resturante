import RestaurantInput from "../interfaces/Input/ResturanteInput";
import RestauranteOutput from "../interfaces/Outputs/ResturanteOutput";
import Restaurante from "../models/Restaurante";
const prisma = require("../../prisma/prismaClient");

// criar um novo restaurante
async function create(restauranteInput: RestaurantInput): Promise<RestauranteOutput> {
  // criando o restaurante no banco de dados
  const restaurante: Restaurante = await prisma.restaurante.create({
    data: restauranteInput,
  });

  // retornando os dados no formato de saída esperado
  return {
    id: restaurante.id,
    nome: restaurante.nome,
    telefone: restaurante.telefone,
    endereco: restaurante.endereco,
    fotoUrl: restaurante.fotoUrl,
  };
}

// buscar todos os restaurantes
async function getAll(): Promise<RestauranteOutput[]> {
  const restaurantes: Restaurante[] = await prisma.restaurante.findMany({
    where: { status: true },
  });

  if (restaurantes.length === 0) {
    throw new NotFoundError();
  }

  // transformar os dados no formato de saída esperado
  return restaurantes.map((restaurante) => ({
    id: restaurante.id,
    nome: restaurante.nome,
    telefone: restaurante.telefone,
    endereco: restaurante.endereco,
    fotoUrl: restaurante.fotoUrl,
  }));
}

export default {
  create,
  getAll,
};
