const { Router } = require("express")
const router = Router()

const multer = require('multer');
const path = require('path');
const fs = require("fs");

const {
    postUsuario

} = require("../controllers/auth.controller.js")

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

router.post("/", upload.single('file'), async (req, res) => {
    const usuario = req.body;
    const urlImagenProducto = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;


    console.log("Archivo subido:", req.file); // Verifica la información del archivo subido
    console.log("URL de la imagen generada:", urlImagenProducto); // Verifica la URL de la imagen generada


    try {
        const newUsuario = await postUsuario(usuario,
            urlImagenProducto);

        return res.status(200).json(newUsuario)
    } catch (error) {
        console.error("Error al crear el usuario:", error); // Agrega más detalles al error
        return res.status(500).send(error.message);
    }
});





module.exports = router