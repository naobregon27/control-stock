const {Producto} = require("../db.js")


const postProducto = async (producto, urlImagenProducto) => {
  try {
    console.log("URL de la imagen:", urlImagenProducto); // Verifica el valor de urlImagenProducto
    const [newProducto, created] = await Producto.findOrCreate({
      where: { nombreProducto: producto.nombreProducto },
      defaults: {
        marca: producto.marca,
        precio: producto.precio,
        cantidad: producto.cantidad,
        categoria: producto.categoria,
        // subcategoria: producto.subcategoria,
        // imagen: urlImagenProducto || null 
      },
    });

    if (!created) {
      throw new Error('El producto ya existe.');
    }

    return newProducto;
  } catch (error) {
    console.error("Error al crear el producto:", error); // Agrega más detalles al error
    throw new Error('Lo siento, no fue posible crear el Producto: ' + error.message);
  }
};

  const getAllProductos = async () => {
    try {
      const comunas = await Producto.findAll();
      return comunas;
    } catch (error) {
      throw new Error("Lo sentimos no hay registros para mostrar.");
    }
  };

  const getProductoById = async (id) => {
    try {
      const producto = await Producto.findByPk(id);
      return producto;
    } catch (error) {
      throw new Error(`No existe o no se encontro el registro con id: ${id}`);
    }
  };

  const updateProducto = async (id, nProducto, urlImagenProducto) => {
    try {
        const editProducto = await Producto.findByPk(id);
        if (!editProducto) {
            return { error: "No se encontró el producto." };
        }
        console.log("URL de la imagen:", urlImagenProducto); // Verifica el valor de urlImagenProducto
        await Producto.update(
            {
                nombreProducto: nProducto.nombreproducto,
                precio: nProducto.precio,
                cantidad: nProducto.cantidad,
                categoria: nProducto.categoria,
                subcategoria: nProducto.subcategoria,
                dirigidoA: nProducto.dirigidoA,
                imagen: urlImagenProducto || null 
            },
            { where: { id } }
        );
        const updateProducto = await Producto.findByPk(id);
        return updateProducto;
    } catch (error) {
        console.error("Error al actualizar el producto:", error); // Agrega más detalles al error
        throw new Error("Error no pudimos actualizar el producto.");
    }
};

  const deleteProducto = async (id) => {
    try {
      const deleteProducto = await Producto.findByPk(id);
      if (!deleteProducto) {
        return { error: "Lo sentimos no encontramos el producto." };
      }
      await deleteProducto.destroy();
      return { mensaje: "El Producto fue eliminada correctamente" };
    } catch (error) {
      throw Error("Error no se puedo eliminar el producto.");
    }
  };
  
module.exports= {
    postProducto,
    getAllProductos,
    getProductoById,
    updateProducto,
    deleteProducto
}

  