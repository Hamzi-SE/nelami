import React, { useState, useEffect } from "react";

// Product Card Import
import ProductCard from "../../Components/ProductCard/ProductCard";

//Random Id
import generateId from "../../utils/RandomIdGen";



const MiscProductSlider = (props) => {
    const { products } = props;
    const [miscProducts, setMisProducts] = useState([])


    useEffect(() => {

        setMisProducts(products.filter(product => product.category === "MiscProducts"))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>

            <div className="d-flex">

                {

                    //Get 4 random misc products from the misc products array
                    miscProducts?.sort(() => Math.random() - 0.5).slice(0, 4).map((miscProduct) => {
                        return (<div className="w-25" key={generateId()}>
                            <ProductCard product={miscProduct} index={generateId()} />
                        </div>)
                    })
                }
            </div>
        </>
    )
}

export default MiscProductSlider