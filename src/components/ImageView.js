import React from "react";

const ImageView = ({ name, imageURL, onClick }) => {
  if (imageURL) {
    return (
      <img
        onClick={onClick}
        className='list-thumbnail responsive border-0 card-img-left'
        src={imageURL}
        alt='image-key'
      />
    );
  }
  return <span className='image-preview'>{name?.charAt(0)}</span>;
};

export default ImageView;
