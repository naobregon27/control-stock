const { Router } = require("express");
const router = Router();

const routerProducto = require("./task.router.js");
const authRoutes = require ("./auth.router.js");
const routerVentas = require ("./ventas.router.js")

router.use("/auth", authRoutes);
router.use("/ventas", routerVentas);
router.use("/task", routerProducto);




module.exports = router;