// const { DataTypes } = require("sequelize");

// module.exports = (sequelize) => {
//   sequelize.define(
//     "UsuarioRoles",
//     {
//       usuarioId: {
//         type: DataTypes.UUID,
//         allowNull: false,
//       },
//       roleId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//           isIn: {
//             args: [[1, 2]], // IDs válidos para administrador (1) y moderador (2)
//             msg: "Rol no válido",
//           },
//         },
//       },
//     },
//     {
//       timestamps: false, // No necesitamos timestamps en la tabla intermedia
//     }
//   );
// };

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UsuarioRoles = sequelize.define(
    "Role",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return UsuarioRoles;
};