const { Ventas } = require("../db.js")
console.log(Ventas)

const postVentas = async (venta, urlImagenVenta) => {
  try {
    console.log('Datos de venta:', venta);
    console.log("URL de la imagen:", urlImagenVenta); // Verifica el valor de urlImagenProducto

    // Validar datos
    if (!venta.nombreProducto || !venta.precio || !venta.cantidad || !venta.documentoCliente || !venta.nombreCliente || !venta.productoId) {
      throw new Error('Todos los campos son obligatorios.');
    }

    // Crear una nueva venta
    const nuevaVenta = await Ventas.create({
      nombreProducto: venta.nombreProducto,
      precio: venta.precio,
      cantidad: venta.cantidad,
      documentoCliente: venta.documentoCliente,
      nombreCliente: venta.nombreCliente,
      medioPago: venta.medioPago,
      productoId: venta.productoId, // Asegúrate de incluir productoId
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return nuevaVenta;

  } catch (error) {
    console.error("Error al crear la venta:", error);
    throw new Error('Lo siento, no fue posible crear la venta: ' + error.message);
  }
};

const getAllVentas = async () => {
  try {
    const comunas = await Ventas.findAll();
    return comunas;
  } catch (error) {
    throw new Error("Lo sentimos no hay registros para mostrar.");
  }
};

const getVentasById = async (id) => {
  try {
    const ventas = await Ventas.findByPk(id);
    return ventas;
  } catch (error) {
    throw new Error(`No existe o no se encontro el registro con id: ${id}`);
  }
};




module.exports = {
  postVentas,
  getAllVentas,
  getVentasById,

}