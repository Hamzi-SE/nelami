import React, { useState, useEffect } from "react";

// Product Card Import
import ProductCard from "../../Components/ProductCard/ProductCard";


//Random Id
import generateId from "../../utils/RandomIdGen";



const PropertySlider = (props) => {
    const { products } = props;
    const [properties, setProperties] = useState([])


    useEffect(() => {

        setProperties(products.filter(product => product.category === "Property"))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>

            <div className="d-flex">

                {

                    //Get 4 random properties from the properties array
                    properties?.sort(() => Math.random() - 0.5).slice(0, 4).map((property) => {
                        return (<div className="w-25" key={generateId()}>
                            <ProductCard product={property} index={generateId()} />
                        </div>)
                    })
                }
            </div>

        </>
    )
}

export default PropertySlider