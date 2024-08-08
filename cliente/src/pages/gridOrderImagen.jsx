import React from 'react';

const GridOrderImage = (props) => {
  return (
    <div className="image-container">
      <img src={props.imagen} alt={props.nombreProducto} className="product-image" />
    </div>
  );
};

export default GridOrderImage;