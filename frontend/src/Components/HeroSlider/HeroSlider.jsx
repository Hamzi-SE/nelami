import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./herSlider.css";

// import img_slide_1 from "../../../assets/images/slider-img-1.png";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";

const func = () => {
    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                speed={1200}
                pagination={{
                    clickable: true,
                }}
                // navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="hero-slider"
            >
                <SwiperSlide>
                    <div className="slider-container">
                        <div className="content">
                            <h2><b>Best Available</b></h2>
                            <h3>Auctions</h3>
                            {/* <p>Sale upto <span>20%</span> OFF!</p> */}
                            {/* <button type="button" className="btn btn-shop-now">Vehicles</button> */}
                        </div>
                        <div className="slide-img-wrapper">
                            <img src="https://ibid.modeltheme.com/automotive/wp-content/uploads/2020/01/slider_car.png" alt="slider-img-1" />
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slider-container">
                        <div className="content">
                            <h2><b>Best Available</b></h2>
                            <h3>Auctions</h3>
                            {/* <p>Sale upto <span>20%</span> OFF!</p> */}
                            {/* <button type="button" className="btn btn-shop-now">Shop Now</button> */}
                        </div>
                        <div className="slide-img-wrapper">
                            <img src="https://i.postimg.cc/J06pmq6p/car-img-2-removebg-preview.png" alt="slider-img-2" />
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>


        </>
    );
}
export default func;