require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
// const { DB_USER, DB_PASSWORD, DB_HOST, DB_RENDER } = process.env;

// const sequelize = new Sequelize("stock", DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: "postgres",
//   logging: false,
//   native: false,
//   ssl: true,
// });

//! este sequelize es para RENDERIZADO... DEPLOY DB en render.s.

const sequelize = new Sequelize("postgresql://postgress:pBjYQoFc3mcW6lv4HbKrSOd57KdJlLY0@dpg-cqqj5sl6l47c73avhvqg-a/stock_0h8m", {
  logging: false,
  native: false,
  dialectOptions: {
    ssl: true, // Deshabilitar la conexión SSL/TLS
    rejectUnauthorized: false

  },
});

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize, DataTypes));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Producto, Usuario, Role, Ventas } = sequelize.models;

Usuario.belongsToMany(Role, { through: 'UsuarioUsuarioRoles' });
Role.belongsToMany(Usuario, { through: 'UsuarioUsuarioRoles' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};