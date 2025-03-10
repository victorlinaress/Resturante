import RestauranteOutput from "./ResturanteOutput";
import UserOutput from "./UserOutput";

export default interface PedidoOutput {
  id: number;
  idRestaurante: number;
  userOutput: UserOutput;
  restauranteOutput: RestauranteOutput;

  data: Date;
}
