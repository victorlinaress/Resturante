import { Request, Response } from "express";
import RestauranteInput from "../interfaces/Input/RestauranteInput";
import RestauranteOutput from "../interfaces/Outputs/RestauranteOutput";
import restauranteService from "../services/restauranteService";
import NotFoundError from "../errors/NotFoundError"; // Importação da classe NotFoundError

async function create(req: Request, res: Response) {
  const restauranteInput: RestauranteInput = req.body;

  try {
    const restauranteOutput: RestauranteOutput = await restauranteService.create(restauranteInput);
    res.status(201).json(restauranteOutput);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o restaurante", descricao: error });
  }
}

async function getAll(req: Request, res: Response) {
  try {
    const restauranteOutput: RestauranteOutput[] = await restauranteService.getAll();
    res.status(200).json(restauranteOutput);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: "Restaurantes não encontrados", descricao: error });
    } else {
      res.status(500).json({ error: "Erro ao buscar restaurantes", descricao: error });
    }
  }
}

async function getById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const restauranteOutput: RestauranteOutput = await restauranteService.getById(Number(id));
    res.status(200).json(restauranteOutput);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: "Restaurante não encontrado", descricao: error });
    } else {
      res.status(500).json({ error: "Erro ao buscar restaurante", descricao: error });
    }
  }
}

async function update(req: Request, res: Response) {
  const { id } = req.params;
  const restauranteInput: RestauranteInput = req.body;

  try {
    const restauranteOutput: RestauranteOutput = await restauranteService.update(Number(id), restauranteInput);
    res.status(200).json(restauranteOutput);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar restaurante", descricao: error });
  }
}

async function remove(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await restauranteService.remove(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar restaurante", descricao: error });
  }
}

async function search(req: Request, res: Response): Promise<void> {
  const { termo } = req.params;

  console.log("Termo de busca:", termo);

  if (typeof termo !== "string" || termo.trim() === "") {
    res.status(400).json({ error: "O termo de busca não pode estar vazio." });
    return;
  }

  try {
    const result = await restauranteService.search(termo as string);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao fazer a busca:", error);
    res.status(500).json({ error: "Erro ao fazer a busca." });
  }
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
  search,
};
