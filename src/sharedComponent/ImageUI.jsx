import React from 'react'

const ImageUI = (props) => {
  return (
    <img src={props?.src} alt={props.alt} loading="lazy"/>
  )
}

export default ImageUI