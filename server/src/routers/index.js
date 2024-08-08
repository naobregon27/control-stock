const { Router } = require("express");
const router = Router();

const routerProducto = require("./task.router.js");
const routerUsers= require ("./auth.router.js");
const routerVentas = require ("./ventas.router.js")

router.use("/auth", routerUsers);
router.use("/ventas", routerVentas);
router.use("/task", routerProducto);




module.exports = router;