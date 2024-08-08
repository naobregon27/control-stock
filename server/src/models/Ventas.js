const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Ventas",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      nombreProducto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      nombreCliente: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      documentoCliente: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};