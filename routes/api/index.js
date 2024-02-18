const router = require("express").Router();
const authRoutes = require("./users");
const mazesRoutes = require("./mazes");
const boxesRoutes = require("./boxes");

// Utilisation des routes pour les différentes fonctionnalités
// Routes liées respectivement à l'authentification des utilisateurs ,opérations sur le labyrinthe
//et les opérations reliées aux cases du labyrinthe
router.use("/auth", authRoutes);
router.use("/mazes", mazesRoutes);
router.use("/boxes", boxesRoutes);

router.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {}),
    });
  }
  return next(err);
});

module.exports = router;
