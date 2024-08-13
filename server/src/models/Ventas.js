const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  const Ventas = sequelize.define(
    "Ventas",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      productoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Productos', // Nombre de la tabla de productos
          key: 'id'
        }
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
      medioPago: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );

  Ventas.associate = (models) => {
    Ventas.belongsTo(models.Producto, {
      foreignKey: 'productoId',
      as: 'producto'
    });
  };

  return Ventas;
};