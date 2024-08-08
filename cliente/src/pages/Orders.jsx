import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { GridComponent, ColumnsDirective, CommandColumn, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject, Toolbar, Search } from '@syncfusion/ej2-react-grids';

import { contextMenuItems, ordersGrid } from '../data/dummy';
import { Header } from '../components';

import GridOrderImage from "../../../cliente/src/pages/gridOrderImagen"

import "./Orders.css"

const Orders = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const editing = { allowDeleting: true, allowEditing: true };

  const navigate = useNavigate();

  const handleEdit = (args) => {
    // Suponiendo que 'id' es el campo que contiene el identificador único del producto
    const { id } = args.rowData;
    navigate(`/Add/${id}/edit`);
  };

  useEffect(() => {
    axios.get('http://localhost:4000/task')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos:', error);
      });
  }, []);

  const handleDelete = (e) => {
    const { id } = e.rowData;
    axios.delete(`http://localhost:4000/task/delete/${id}`)
      .then(response => {
        setData(prevData => prevData.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error('Error al eliminar el elemento:', error);
      });
  };

  const commands = [{ type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', click: handleDelete } },
  { type: 'Edit', buttonOption: { iconCss: 'e-icons e-edit', click: handleEdit } }
  ];

  const toolbarOptions = ['Search'];

  // Función para manejar el cambio en la barra de búsqueda
  const onSearch = (e) => {
    setSearchText(e.target.value);
    data.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
  };


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Inventory" />
      {/* <input
        type="search"
        value={searchText}
        onChange={onSearch}
        placeholder="Buscar..."
        className="my-2 p-2 border-2 border-gray-300 rounded-md"
      /> */}
      <GridComponent
       
        id="gridcomp"
        dataSource={data}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
        toolbar={toolbarOptions}
        searchSettings={{ fields: ['nombreProducto'], operator: 'contains', key: searchText }}
        commandClick={(args) => {
          if (args.commandColumn.buttonOption.content === 'Delete') {
            handleDelete(args);
          } else if (args.commandColumn.buttonOption.iconCss === 'e-icons e-edit') {
            handleEdit(args);
          }

        }}

      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
          <ColumnDirective headerText='Acciones' width='160' commands={commands}></ColumnDirective>
        </ColumnsDirective>
        {/* <ColumnDirective headerText='Imagen' width='150' template={(props) => <GridOrderImage imagen={props.imagen} nombreProducto={props.nombreProducto} />} /> */}
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, CommandColumn, Toolbar, Search]} />
      </GridComponent>

    
    </div>
  );
};

export default Orders;