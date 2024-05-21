import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import generateId from "../../utils/RandomIdGen";

const MiscProductSlider = ({ products }) => {
    const [miscProducts, setMiscProducts] = useState([]);

    useEffect(() => {
        // Filters misc products by category and sets them to state
        setMiscProducts(products.filter(product => product.category === "MiscProducts"));
    }, [products]); // Correctly listen to changes in products

    // useMemo to shuffle and slice misc products only when they change
    const displayedMiscProducts = useMemo(() => {
        const shuffleArray = (array) => {
            const newArr = array.slice(); // Clone to avoid mutation
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // Swap elements
            }
            return newArr;
        };
        return shuffleArray(miscProducts).slice(0, 4); // Select the first 4 for display
    }, [miscProducts]);

    return (
        <div className="d-flex flex-wrap">
            {displayedMiscProducts.map((miscProduct) => (
                <div className="col-lg-3 col-md-6 col-sm-12" key={generateId()}>
                    <ProductCard product={miscProduct} index={generateId()} />
                </div>
            ))}
        </div>
    );
};

export default MiscProductSlider;
