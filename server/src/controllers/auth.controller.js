const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../models/users');

exports.signup = async (req, res) => {
  const { username, email, password, roles } = req.body;
  try {
    const user = await User.create({ username, email, password });

    if (roles) {
      const rolesFound = await Role.findAll({
        where: {
          name: roles
        }
      });
      await user.setRoles(rolesFound);
    } else {
      const role = await Role.findOne({ where: { name: 'employee' } });
      await user.setRoles([role]);
    }

    res.status(201).send({ message: "Usuario registrado exitosamente!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Contraseña incorrecta." });
    }

    const roles = await user.getRoles();
    const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

    const token = jwt.sign({ id: user.id, roles: authorities }, "secret-key", { expiresIn: 86400 });
    res.status(200).send({ id: user.id, username: user.username, email: user.email, roles: authorities, accessToken: token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};