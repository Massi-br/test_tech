const express = require("express");
const router = express.Router();
const authenticateToken = require("../auth");
const MazeModel = require("../../models/Maze");

// Middleware d'authentification requis pour toutes les routes de ce routeur
router.use(authenticateToken.required);

// Endpoint pour la création d'un nouveau labyrinthe
router.post("/", async (req, res) => {
  const nameMaze = req.body;
  try {
    if (!nameMaze) {
      return res.status(400).json({
        message: "Merci de bien vouloir entrer le nom du nouveau labyrinthe",
      });
    }
    const existingMaze = await MazeModel.findOne({ name: nameMaze });
    if (existingMaze) {
      return res.status(409).json({ error: "Le labyrinthe existe déjà" });
    }

    const newMaze = new MazeModel({ name: nameMaze });
    const savedMaze = await newMaze.save();

    return res.status(201).json(savedMaze);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Endpoint pour récupérer tous les labyrinthes
router.get("/", async (req, res) => {
  try {
    const mazes = await MazeModel.find();

    res.status(200).json(mazes);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint pour récupérer un labyrinthe spécifique par son ID
router.get("/:mazeId", async (req, res) => {
  const mazeId = req.params.mazeId;
  try {
    const maze = await MazeModel.findById(mazeId);
    if (!maze) {
      return res.status(404).json({ error: "Labyrinthe non trouvé" });
    }
    return res.status(200).json(maze);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint pour mettre à jour un labyrinthe spécifique par son ID
router.put("/:mazeId", async (req, res) => {
  const mazeId = req.params.mazeId;
  try {
    const maze = await MazeModel.findById(mazeId);
    if (!maze) {
      return res.status(404).json({ error: "Labyrinthe non trouvé" });
    }

    const updatedMaze = await MazeModel.findByIdAndUpdate(maze, req.body, {
      new: true,
    });
    return res.status(200).json(updatedMaze);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint pour supprimer un labyrinthe spécifique par son ID
router.delete("/:mazeId", async (req, res) => {
  const mazeId = req.params.mazeId;
  try {
    const maze = await MazeModel.findById(mazeId);
    if (!maze) {
      return res
        .status(404)
        .json({ error: "Labyrinthe non trouvé,[déja supprimé]" });
    }
    const deletedMaze = await MazeModel.findByIdAndDelete(maze);
    return res.status(200).json("Labyrinthe supprimé : " + deletedMaze);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
