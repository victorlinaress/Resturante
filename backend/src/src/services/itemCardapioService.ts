import ItemCardapioInput from "../interfaces/Input/ItemCardapioInput";
import ItemCardapioOutput from "../interfaces/Outputs/ItemCardapioOutput";
import itemCardapio from "../models/ItemCardapio";

async function create(
  itemCardapioInput: ItemCardapioInput
): Promise<ItemCardapioOutput> {
  // Cria o item de cardápio no banco de dados
  const itemCardapio = await prisma.itens_cardapio.create({
    data: itemCardapioInput,
  });

  // Monta a resposta formatada para o usuário
  const itemCardapioOutput: ItemCardapioOutput = {
    id: itemCardapio.id,
    nome: itemCardapio.nome,
    descricao: itemCardapio.descricao,
    preco: itemCardapio.preco,
    fotoUrl: itemCardapio.fotoUrl,
    idRestaurante: itemCardapio.idRestaurante,
  };

  return itemCardapioOutput;
}

async function getAllForRestaurant(
  idRestaurant: number
): Promise<ItemCardapioOutput[]> {
  const itensCardapio: itemCardapio[] = await prisma.itens_cardapio.findMany({
    where: { status: true, idRestaurant: idRestaurant },
  });

  if (itensCardapio.length === 0) {
    throw new NotFoundError();
  }

  const itemCardapioOutput: ItemCardapioOutput[] = await Promise.all(
    itensCardapio.map(async (itemCardapio) => {
      const restauranteOutput = await restauranteService.getById(
        itemCardapio.idRestaurante
      );
      return {
        id: itemCardapio.id,
        restauranteOutput: restauranteOutput, // detalhes do restaurante
        nome: itemCardapio.nome,
        descricao: itemCardapio.descricao,
        preco: itemCardapio.preco,
        fotoUrl: itemCardapio.fotoUrl,
      };
    })
  );

  return itemCardapioOutput;
}

async function getById(id: number): Promise<ItemCardapioOutput> {
    const itemCardapio: itemCardapio | null = await prisma.itens_cardapio.findUnique({
      where: { id, status: true },
    });
  