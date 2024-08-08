const {Router} = require ("express")
const router = Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs");


const {
    postVentas,
    getAllVentas,
    getVentasById,
} = require ("../controllers/ventas.controller.js")

// Verifica si la carpeta 'uploads' existe, si no, la crea
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // La ruta ya está verificada y creada si es necesario
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rutas
router.post("/", upload.single('file'), async (req, res) => {
    const venta = req.body;
    const urlImagenProducto = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
    console.log('Datos recibidos:', venta);

    console.log("Archivo subido:", req.file); // Verifica la información del archivo subido
    console.log("URL de la imagen generada:", urlImagenProducto); // Verifica la URL de la imagen generada

    try {
        const nuevaVenta = await postVentas(venta, urlImagenProducto);
        return res.status(200).json(nuevaVenta);

    } catch (error) {
        console.error("Error al crear la venta:", error);
        return res.status(500).send(error.message);
    }
});

router.get("/", async (req, res) => {
    try {
      const ventas = await getAllVentas();
      return res.status(200).json(ventas);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const ventas = await getVentasById
      (id);
      return res.status(200).json(ventas);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  

module.exports = router