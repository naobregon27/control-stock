require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_RENDER } = process.env;

const sequelize = new Sequelize("stock", "postgres", "Mateo123", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
  native: false,
  ssl: true,
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