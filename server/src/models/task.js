const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  const Producto = sequelize.define(
    "Producto",
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
      marca: {
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
      categoria: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaIngreso: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );

  Producto.associate = (models) => {
    Producto.hasMany(models.Ventas, {
      foreignKey: 'productoId',
      as: 'ventas'
    });
  };

  return Producto;
};