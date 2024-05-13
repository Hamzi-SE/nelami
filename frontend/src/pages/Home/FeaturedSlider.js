import React from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import generateId from "../../utils/RandomIdGen";

const FeaturedSlider = ({ products }) => {
    // Function to shuffle array
    const shuffleArray = (arr) => {
        const array = arr.slice(); // Create a copy of the array
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    };

    // Shuffled and sliced products
    const displayedProducts = React.useMemo(() => {
        return shuffleArray(products).slice(0, 4);
    }, [products]);

    return (
        <div className="d-flex flex-wrap">
            {displayedProducts.map((product) => (
                <div className="col-lg-3 col-md-6 col-sm-12" key={generateId()}>
                    <ProductCard product={product} index={generateId()} />
                </div>
            ))}
        </div>
    );
};

export default FeaturedSlider;