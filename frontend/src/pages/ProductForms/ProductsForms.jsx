import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoCarSportSharp, IoBusOutline } from "react-icons/io5";
import { FaTractor } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { FiChevronRight } from "react-icons/fi"
import { GrBike } from "react-icons/gr";

import "./ProductsFroms.css";
import MetaData from "../../utils/MetaData";

const ProductsForms = () => {
  const [activeIndex, setActiveIndex] = useState();

  const handleActiveCategory = (e) => {
    setActiveIndex(e.currentTarget.dataset.index);
  };

  return (
    <>
      <MetaData title="Add Product - Nelami" />
      <div className="container product-forms-wrapper product-forms-all">
        <div className="row">
          <div className="col-12">
            <h2 className="m-2 p-3 text-center my-5"><b>POST YOUR AD</b></h2>
          </div>
        </div>
        <div className="row product-form-block">
          <div className="col-12 category-title">
            <h4 className="p-3 m-2">CHOOSE A CATEGORY</h4>
          </div>
          <div className="col-md-4 categories-list categories-list-wrapper categories-select p-0">
            <div data-index={1} onClick={handleActiveCategory} className="category-block category-group">
              <div className="category-icon d-flex justify-content-center align-items-center">
                <IoCarSportSharp />
              </div>
              <div className="category-name">Vehicles</div>
              <div className="open-arrow-icon">
                <FiChevronRight />
              </div>
            </div>
            <div data-index={2} onClick={handleActiveCategory} className="category-block category-group">
              <div className="category-icon d-flex justify-content-center align-items-center">
                <BiBuildingHouse />
              </div>
              <div className="category-name">Property</div>
              <div className="open-arrow-icon">
                <FiChevronRight />
              </div>
            </div>
            <div data-index={3} onClick={handleActiveCategory} className="category-block category-group">
              <div className="category-icon d-flex justify-content-center align-items-center">
                <BiBuildingHouse />
              </div>
              <div className="category-name">Miscellaneous</div>
              <div className="open-arrow-icon">
                <FiChevronRight />
              </div>
            </div>
          </div>

          <div className="col-md-4 category-drop-downs p-0">
            {/* Vehicle Sub Categories */}
            {/* eslint-disable-next-line*/}
            {activeIndex == 1 && (
              <div className="subcategories-wrapper vehicle-categories">
                <div className="subcategory-block ">
                  <Link to="/product/new/car">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <IoCarSportSharp />
                    </div>

                    <div className="subcategory-name">Cars</div>

                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/bike">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <GrBike />
                    </div>
                    <div className="subcategory-name">Bikes</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/bus">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <IoBusOutline />
                    </div>
                    <div className="subcategory-name">Buses, Vans & Trucks</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/rickshaw">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <IoCarSportSharp />
                    </div>
                    <div className="subcategory-name">Rickshaw & Chingchi</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/tractor">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <FaTractor />
                    </div>
                    <div className="subcategory-name">Tractors & Trailer</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/other-vehicle">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <IoCarSportSharp />
                    </div>
                    <div className="subcategory-name">Other Vehicles</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
              </div>
            )}
            {/* Vehicle Categories END */}

            {/* Property Sub Categories */}
            {/* eslint-disable-next-line*/}
            {activeIndex == 2 && (
              <div className="subcategories-wrapper vehicle-categories">
                <div className="subcategory-block">
                  <Link to="/product/new/land">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <BiBuildingHouse />
                    </div>
                    <div className="subcategory-name">Land & Plots</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/house">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <BiBuildingHouse />
                    </div>
                    <div className="subcategory-name">Houses</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/apartment">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <BiBuildingHouse />
                    </div>
                    <div className="subcategory-name">Apartments & Flats</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/shop">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <BiBuildingHouse />
                    </div>
                    <div className="subcategory-name">Shops - Offices - Commercial Space</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
                <div className="subcategory-block">
                  <Link to="/product/new/portion">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <BiBuildingHouse />
                    </div>
                    <div className="subcategory-name">Portions & Floors</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>

                </div>

              </div>
            )}
            {/* eslint-disable-next-line*/}
            {activeIndex == 3 && (
              <div className="subcategories-wrapper vehicle-categories">
                <div className="subcategory-block">
                  <Link to="/product/new/misc">
                    <div className="subcategory-icon d-flex justify-content-center align-items-center">
                      <BiBuildingHouse />
                    </div>
                    <div className="subcategory-name">Other Product</div>
                    <div className="open-arrow-icon">
                      {/* <FiChevronRight /> */}
                    </div>
                  </Link>
                </div>
              </div>
            )}
            {/* Vehicle Categories END */}
          </div>

          <div className="col-md-4 p-0 col-third"></div>
        </div>
      </div>
    </>
  );
};

export default ProductsForms;
