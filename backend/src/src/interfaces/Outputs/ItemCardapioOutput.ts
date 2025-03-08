export default interface ItemCardapioOutput {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  fotoUrl: string;
  idRestaurante: number;
  restauranteOutput: RestauranteOutput;
}
