import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import generateId from "../../utils/RandomIdGen";

const PropertySlider = ({ products }) => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        // Filters properties by category and sets them to state
        setProperties(products.filter(product => product.category === "Property"));
    }, [products]); // Add products as a dependency to ensure updates are reflected

    // useMemo to shuffle and slice properties only when they change
    const displayedProperties = useMemo(() => {
        const shuffleArray = (array) => {
            const newArr = array.slice(); // Clone to avoid mutation
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // Swap elements
            }
            return newArr;
        };
        return shuffleArray(properties).slice(0, 4); // Select the first 4 for display
    }, [properties]);

    return (
        <div className="d-flex flex-wrap">
            {displayedProperties.map((property) => (
                <div className="col-lg-3 col-md-6 col-sm-12" key={generateId()}>
                    <ProductCard product={property} index={generateId()} />
                </div>
            ))}
        </div>
    );
};

export default PropertySlider;