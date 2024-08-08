import React from "react";
import './App.css';

import Autosuggest from 'react-autosuggest';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Ventas = () => {
    const [data, setData] = useState([]);
    const [productos, setProductos] = useState([]);
    const [value, setValue] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState({
        id: '',
        nombreProducto: '',
        marca: '',
        precio: ''
    });
    const [cliente, setCliente] = useState({
        nombreProducto: "",
        precio: "",
        nombreCliente: '',
        documentoCliente: '',
        cantidad: ''
    });

    useEffect(() => {
        setCliente(prevCliente => ({
            ...prevCliente,
            nombreProducto: productoSeleccionado.nombreProducto,
            precio: productoSeleccionado.precio
        }));
    }, [productoSeleccionado]);



    const onSuggestionsFetchRequested = ({ value }) => {
        setProductos(filtrarProductos(value));
    };

    const filtrarProductos = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : data.filter(producto =>
            producto.nombreProducto.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(inputValue)
        );
    };

    const onSuggestionsClearRequested = () => {
        setProductos([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.nombreProducto;

    const renderSuggestion = (suggestion) => (
        <div className='sugerencia' onClick={() => seleccionarProducto(suggestion)}>
            {suggestion.nombreProducto}
        </div>
    );

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setValue(producto.nombreProducto);
    };

    const onChange = (e, { newValue }) => {
        setValue(newValue);
    };

    const inputProps = {
        placeholder: "Nombre del Producto",
        value,
        onChange
    };

    const obtenerData = () => {
        axios.get("http://localhost:4000/task").then(response => {
            setProductos(response.data);
            setData(response.data);
        });
    };

    useEffect(() => {
        obtenerData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const venta = {
            ...productoSeleccionado,
            nombreCliente: cliente.nombreCliente,
            documentoCliente: cliente.documentoCliente,
            cantidad: cliente.cantidad
        };
        axios.post("http://localhost:4000/ventas", venta)
            .then(response => {
                console.log("Venta guardada:", response.data);
            })
            .catch(error => {
                console.error("Hubo un error al guardar la venta:", error);
            });
    };

    const handleClienteChange = (e) => {
        const { name, value } = e.target;
        setCliente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="App">
            <Autosuggest
                suggestions={productos}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
            <br />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" className="form-control" value={productoSeleccionado.nombreProducto} readOnly />
                </div>
                <div className="form-group">
                    <label>Precio</label>
                        <input type="text" className="form-control" value={`$${productoSeleccionado.precio}`} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Cantidad Vendida</label>
                        <input type="number" className="form-control" name="cantidad" value={cliente.cantidad} onChange={handleClienteChange} />
                    </div>
                    <div className="form-group">
                        <label>Nombre del Cliente</label>
                        <input type="text" className="form-control" name="nombreCliente" value={cliente.nombreCliente} onChange={handleClienteChange} />
                    </div>
                    <div className="form-group">
                        <label>Documento del Cliente</label>
                        <input type="text" className="form-control" name="documentoCliente" value={cliente.documentoCliente} onChange={handleClienteChange} />
                    </div>

                    <button type="submit" className="btn btn-primary">Guardar Venta</button>
            </form>
        </div>
    );
};

export default Ventas;


