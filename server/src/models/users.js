const bcrypt = require("bcryptjs");
const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

  // Hook para cifrar la contraseña antes de guardar el usuario
  User.beforeCreate(async (user) => {
    user.passwordHash = await bcrypt.hash(user.password, 8);
  });

  return User;
};