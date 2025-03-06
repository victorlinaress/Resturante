export default class itemCardapio {
  id: number;
  preco: number;
  nome: string;
  fotoUrl: string;
  descricao: string;
  idRestaurante: number;

  constructor(){
    this.id = 0;
    this.idRestaurante = 0;
    this.nome = "";
    this.descricao = "";
    this.preco = 0;
    this.fotoUrl = "";
}
}
