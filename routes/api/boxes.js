const router = require("express").Router();
const authenticateToken = require("../auth");
const BoxesModel = require("../../models/Box");

// Middleware d'authentification requis pour toutes les routes de ce routeur
router.use(authenticateToken.required);

// Endpoint pour la création d'une nouvelle case dans le labyrinthe
router.post("/", async (req, res) => {
  const { x, y, isAllowed, maze } = req.body;
  try {
    if (!x || !y || maze === undefined) {
      return res.status(400).json({
        message: "Merci de bien vouloir entrer tous les champs obligatoires",
      });
    }
    const existingBox = await BoxesModel.findOne({ x, y, maze });
    if (existingBox) {
      return res.status(409).json({ error: "La case existe déjà" });
    }

    const newBox = new BoxesModel({ x, y, isAllowed, maze });
    const savedBox = await newBox.save();
    return res.status(201).json(savedBox);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la création de la case" });
  }
});

// Endpoint pour récupérer toutes les boîtes
router.get("/", async (req, res) => {
  try {
    const boxes = await BoxesModel.find();
    return res.status(200).json(boxes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Endpoint pour récupérer une boîte spécifique par son ID
router.get("/:boxId", async (req, res) => {
  const boxId = req.params.boxId;
  try {
    const box = await BoxesModel.findById(boxId);
    if (!box) {
      return res.status(404).json({ error: "box non trouvée" });
    }
    return res.status(200).json(box);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Endpoint pour mettre à jour une boîte spécifique par son ID
router.put("/:boxId", async (req, res) => {
  const boxId = req.params.boxId;
  try {
    const box = await BoxesModel.findById(boxId);
    if (!box) {
      return res.status(404).json({ error: "box non trouvée" });
    }
    const updatedBox = await BoxesModel.findByIdAndUpdate(box, req.body, {
      new: true,
    });
    return res.status(200).json("case modifié : " + updatedBox);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint pour supprimer une boîte spécifique par son ID
router.delete("/:boxId", async (req, res) => {
  const boxId = req.params.boxId;
  try {
    const box = await BoxesModel.findById(boxId);
    if (!box) {
      return res.status(404).json({ error: "box non trouvée,[déja supprimé]" });
    }
    const deletedBox = await BoxesModel.findByIdAndDelete(box);
    return res.status(200).json("case supprimée : " + deletedBox);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
