import ItemCardapioInput from "../interfaces/Input/ItemCardapioInput";
import ItemCardapioOutput from "../interfaces/Outputs/ItemCardapioOutput";

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
