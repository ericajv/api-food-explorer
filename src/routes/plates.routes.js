const { Router } = require("express");

const PlatesController = require("../controllers/PlatesController");

const platesRoutes = Router();

const platesController = new PlatesController();
platesRoutes.post("/", platesController.create);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", platesController.delete);


module.exports = platesRoutes;