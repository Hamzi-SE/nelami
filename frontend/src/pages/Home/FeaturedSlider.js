import React from "react";

// Product Card Import
import ProductCard from "../../Components/ProductCard/ProductCard";

//Random Id
import generateId from "../../utils/RandomIdGen";


const FeaturedSlider = (props) => {
    const { products } = props;

    return (
        <>
            <div className="d-flex">
                {/* Previous button */}
                {/* <div className="prev">
                    <i className="fa fa-chevron-left"></i>
                </div> */}
                {/* Slider */}
                {
                    //Get 4 random products from the products array
                    products?.sort(() => Math.random() - 0.5).slice(0, 4).map((product) => {
                        return (<div className="w-25" key={generateId()}>
                            <ProductCard product={product} index={generateId()} />
                        </div>)
                    })
                }
                {/* Next button */}
                {/* <div className="next">
                    <i className="fa fa-chevron-right"></i>
                </div> */}


            </div>

        </>

    )
}

export default FeaturedSlider
