import React, { useState, useEffect, useMemo } from 'react'
import ProductCard from '../../Components/ProductCard/ProductCard'
import generateId from '../../utils/RandomIdGen'

const LatestProductsSlider = ({ products }) => {
  return (
    <div className="d-flex flex-wrap">
      {products.map((product) => (
        <div className="col-lg-3 col-md-6 col-sm-12" key={generateId()}>
          <ProductCard product={product} index={generateId()} />
        </div>
      ))}
    </div>
  )
}

export default LatestProductsSlider
