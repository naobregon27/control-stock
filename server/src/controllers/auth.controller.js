const { Usuario } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config.js")


const postUsuario = async (usuario, urlImagenProducto) => {
  try {
    const saltRounds = 10; // Número de rondas de sal (ajusta según tus necesidades)
    const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);

    console.log("URL de la imagen:", urlImagenProducto); // Verifica el valor de urlImagenProducto
    const [newUsuario, created] = await Usuario.findOrCreate({
      where: { nombre: usuario.nombre },
      defaults: {
        apellido: usuario.apellido,
        email: usuario.email,
        password: usuario.password,
        passwordHash: hashedPassword,
         // Asigna el hash de la contraseña al campo passwordHash
        // imagen: urlImagenProducto || null
      },
    });

    if (!created) {
      throw new Error('El usuario ya existe.');
    }

    const token = jwt.sign({id: newUsuario._id}, "products-api" ,{
      expiresIn: 60 * 60 * 24 // 1 día
    }
    )



    return token;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw new Error('No fue posible crear el usuario: ' + error.message);
  }
};



module.exports = {
  postUsuario,
};