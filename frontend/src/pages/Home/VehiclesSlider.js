import React, { useState, useEffect } from "react";

// Product Card Import
import ProductCard from "../../Components/ProductCard/ProductCard";


//Random Id
import generateId from "../../utils/RandomIdGen";


const VehiclesSlider = (props) => {
    const { products } = props;
    const [vehicles, setVehicles] = useState([])


    useEffect(() => {

        setVehicles(products.filter(product => product.category === "Vehicles"))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>


            <div className="d-flex">


                {
                    //Get 4 random vehicles from the vehicles array
                    vehicles?.sort(() => Math.random() - 0.5).slice(0, 4).map((vehicle) => {
                        return (<div className="w-25" key={generateId()}>
                            <ProductCard product={vehicle} index={generateId()} />
                        </div>)
                    })
                }



            </div>
        </>
    )
}

export default VehiclesSlider