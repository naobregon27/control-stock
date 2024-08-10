import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";

const Editor = () => {


  const [produc, setProduc] = useState({
    nombreProducto: "",
    marca: "",
    precio: "",
    cantidad: "",
    categoria: "",
  //  imagen: "",

  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      loadTask(params.id);
    }
  }, [params.id]);

  const loadTask = async (id) => {
   // const res = await fetch("http://localhost:3001/task/" + id); //local
   const res = await fetch("https://control-stock-06su.onrender.com/task/" + id); //deployado
    const data = await res.json();
    setProduc({
      nombreProducto: data.nombreProducto, marca: data.marca, precio: data.precio, cantidad: data.cantidad, categoria: data.categoria
    });
  };

  const handleDelete = async (id) => {
    try {
     //await fetch(`http://localhost:4000/task/delete/${id}`, {//Local
      await fetch(`https://control-stock-06su.onrender.com/task/${id}`, {//deployado
        method: "DELETE",
      });
      Swal.fire("Deleted!", "Your product has been deleted.", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "There was an error deleting the product.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (params.id) {
        const response = await fetch(
          //"http://localhost:4000/task/" + params.id, //local
          "https://control-stock-06su.onrender.com/task/" + params.id, //deployado
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produc),
          }
        );
        await response.json();
        Swal.fire("Updated!", "Your product has been updated.", "success");
      } else {
       //const response = await fetch("http://localhost:4000/task", { //local 
       const response = await fetch("https://control-stock-06su.onrender.com/task", { //deployado
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produc),
        });
        await response.json();
        Swal.fire("Updated!", "Your product has been updated.", "success");
      }

      setLoading(false);
      navigate("/Inventory");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'imagen') {
      handleFileChange(e);
    } else {
      setProduc({ ...produc, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProduc({ ...produc, imagen: reader.result });
    };
  };

  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-green-500 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

            <h3 className="text-2xl font-bold my-3">
              {params.id ? "Actualizar Producto" : "Crear Producto"}
            </h3>

            <input
              type="text"
              name="nombreProducto"
              placeholder="Escriba el nombre del Producto"
              className="border border-gray-400 p-2 rounded block my-2 w-full text-black"
              onChange={handleChange}
              value={produc.nombreProducto}
              autoFocus
            />
            <input
              type="text"
              name="marca"
              placeholder="Marca del Producto"
              className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black"
              onChange={handleChange}
              value={produc.marca}
              autoFocus
            />
            <input
              type="text"
              name="precio"
              placeholder="Precio del producto"
              className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black"
              onChange={handleChange}
              value={produc.precio}
              autoFocus
            />
            <input
              type="text"
              name="cantidad"
              placeholder="Cantidad"
              className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black"
              onChange={handleChange}
              value={produc.cantidad}
              autoFocus />

            <input
              type="text"
              name="categoria"
              placeholder="Categoria"
              className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black"
              onChange={handleChange}
              value={produc.categoria}
              autoFocus />

            {/* <input
              type="file"
              name="imagen"
              accept="image/*"
              placeholder="Subir imagen"
              className="border border-gray-400 p-2 rounded-md block my-2 w-full"
              onChange={handleChange}
              autoFocus /> */}

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={!produc.nombreProducto || !produc.marca || !produc.precio || !produc.cantidad || !produc.categoria /* || !produc.imagen*/}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? "Cargando..." : "Guardar"}
              </button>

              {params.id && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(params.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default Editor;

















// import React from 'react';
// import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';

// import { Header } from '../components';
// import { EditorData } from '../data/dummy';

// const Editor = () => (
//   <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
//     <Header category="App" title="Editor" />
//     <RichTextEditorComponent>
//       <EditorData />
//       <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
//     </RichTextEditorComponent>
//   </div>
// );
// export default Editor;
