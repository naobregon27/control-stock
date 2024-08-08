const bcrypt = require("bcrypt");
const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING, // Almacena la contraseña cifrada
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );

  // Método para cifrar la contraseña antes de guardarla
  Usuario.beforeCreate(async (usuario) => {
    if (usuario.changed("password")) {
      const saltRounds = 10; // Número de rondas de sal (ajusta según tus necesidades)
      const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);
      usuario.passwordHash = hashedPassword;
    }
  });

  // Método para comparar contraseñas
  Usuario.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
  };

  return Usuario;
};