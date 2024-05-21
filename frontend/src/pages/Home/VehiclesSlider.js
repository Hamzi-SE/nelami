import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import generateId from "../../utils/RandomIdGen";

const VehiclesSlider = ({ products }) => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const filteredVehicles = products.filter(product => product.category === "Vehicles");
        setVehicles(filteredVehicles);
    }, [products]); // Depend on products so it updates when products change

    // Shuffling and selecting the first 4 vehicles
    const shuffledVehicles = useMemo(() => {
        const shuffleArray = (array) => {
            let newArr = array.slice();
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // Swap elements
            }
            return newArr;
        };
        return shuffleArray(vehicles).slice(0, 4);
    }, [vehicles]); // Only reshuffle when vehicles array changes

    return (
        <div className="d-flex flex-wrap">
            {shuffledVehicles.map((vehicle) => (
                <div className="col-lg-3 col-md-6 col-sm-12" key={generateId()}>
                    <ProductCard product={vehicle} index={generateId()} />
                </div>
            ))}
        </div>
    );
};

export default VehiclesSlider;