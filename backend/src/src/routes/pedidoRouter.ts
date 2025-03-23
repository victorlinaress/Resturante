import express from "express";
import pedidoController from "../controllers/pedidoController";
const router = express.Router();

router.post("/", pedidoController.create);
router.get("/forUser/:idUser", pedidoController.getAllForUsers);
router.get("/:id", pedidoController.getById);
router.put("/:id", pedidoController.update);
router.delete("/:id", pedidoController.remove);
