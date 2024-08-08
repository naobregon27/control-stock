const {Role} = require ("../models/Roles")


const createRoles = async () => {
  try {
    // Crea los roles solo si no existen en la base de datos
    const existingRoles = await Role.findAll();
    if (existingRoles.length > 0) {
      console.log('Los roles ya existen en la base de datos.');
      return;
    }

    // Crea los roles
    const rolesToCreate = [
      { name: 'user' },
      { name: 'moderator' },
      { name: 'admin' },
    ];

    const createdRoles = await Role.bulkCreate(rolesToCreate);
    console.log('Roles creados exitosamente:', createdRoles.map(role => role.name));
  } catch (error) {
    console.error('Error al crear los roles:', error);
  }
};

// Exporta la función para usarla en otros archivos
module.exports = {
  createRoles,
};